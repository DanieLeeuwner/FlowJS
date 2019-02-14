"use strict";

class ConnectorMovementHandler extends MovementHandler {
  constructor(designer) {
    super(designer);

    this.initialConnector = undefined;
    this.finalConnector = undefined;

    this.element = undefined;
    this.shadowElement = undefined;

    this.stroke = undefined;
  }

  start(position) {
    super.start(position);

    this.designer.nodeMovementHandler.setSelection();

    this.stroke = FlowJS.Tools.SelectRandom(this.designer.theme.Link);
    var thickness = FlowJS.Config.Link.Thickness;
    var shadowThickness = FlowJS.Config.Link.Shadow.Thickness;
    var shadowOpacity = FlowJS.Config.Link.Shadow.Opacity;

    if (FlowJS.Config.Link.Shadow.Enabled) {
      this.shadowElement = FlowJS.Tools.GenerateSVG('path');
      this.designer._linkContainer.appendChild(this.shadowElement);

      this.shadowElement.style.stroke = FlowJS.Config.Link.Shadow.Color || this.stroke;
      this.shadowElement.style.fill = 'none';
      this.shadowElement.style.strokeOpacity = shadowOpacity;
      this.shadowElement.style.strokeWidth = shadowThickness;      
    }

    this.element = FlowJS.Tools.GenerateSVG('path');
    this.designer._linkContainer.appendChild(this.element);

    this.element.style.stroke = this.stroke;
    this.element.style.fill = 'none';
    this.element.style.strokeWidth = thickness;
  }

  update(position) {
    super.update(position);

    var data = undefined;

    var initialPosition = this.initialConnector.getPosition();
    var type = this.initialConnector.type;

    switch (FlowJS.Config.Link.Style) {
      case FlowJS.LinkStyle.Custom:
        data = FlowJS.PathTools.GetDataCustom(type, initialPosition, position);
        break;
      case FlowJS.LinkStyle.Direct:
        data = FlowJS.PathTools.GetDataDirect(type, initialPosition, position);
        break;
      case FlowJS.LinkStyle.Spline:
        data = FlowJS.PathTools.GetDataSpline(type, initialPosition, position);      
        break;
    }

    if (data == undefined) return;

    this.element.setAttribute('d', data);

    if (FlowJS.Config.Link.Shadow.Enabled) {
      this.shadowElement.setAttribute('d', data);
    }
  }

  stop(position) {
    super.stop(position);

    if (this.finalConnector) {
      var source = this.initialConnector.type == FlowJS.ConnectorType.Output ? this.initialConnector : this.finalConnector;
      var target = this.initialConnector.type == FlowJS.ConnectorType.Input ? this.initialConnector : this.finalConnector;

      if (source.node != target.node && source.type != target.type) {
        this.designer.createLink(source.getId(), target.getId(), { 
          stroke: this.stroke,
          sourceConnector: source,
          targetConnector: target,
        });
      }
    }

    this.designer._linkContainer.removeChild(this.element);

    if (FlowJS.Config.Link.Shadow.Enabled) {
      this.designer._linkContainer.removeChild(this.shadowElement);
    }

    this.element = undefined;
    this.shadowElement = undefined;

    this.initialConnector.selected = false;
    this.initialConnector.unfocus();
  }
}