"use strict";

class Link {

  constructor(source, target, data) {
    data = data || {};

    this.id = data.id || FlowJS.Tools.GenerateId(8);

    // (node.id).(connector.id)
    this.source = source;
    this.target = target;

    // used while creating link
    this.x = data.x || 0;
    this.y = data.y || 0;

    this.hint = data.hint;
    this.stroke = data.stroke;

    this.selected = false;

    this.sourceConnector = data.sourceConnector;
    this.targetConnector = data.targetConnector;

    this.designer = data.designer;

    this.enableEvents = data.enableEvents != undefined ? data.enableEvents : true;
  }

  export() {
    var link = {
      source: this.source,
      target: this.target,
      hint: this.hint,
      stroke: this.stroke,
    }

    return link;
  }

  focus() {
    if (FlowJS.Config.Link.Shadow.Enabled) {
      FlowJS.Tools.BringToFront(this.designer._linkContainer, this.shadowElement);
    }
    FlowJS.Tools.BringToFront(this.designer._linkContainer, this.element);
    FlowJS.Tools.BringToFront(this.designer._linkContainer, this.overlay);

    this.element.style.stroke = this.designer.theme.Focus;    
    this.sourceConnector.focus();
    this.targetConnector.focus();
  }

  unfocus() {
    if (this.selected) return;

    this.element.style.stroke = this.stroke;
    this.sourceConnector.unfocus();
    this.targetConnector.unfocus();
  }

  refresh() {
    var type = this.sourceConnector.type;
    var sourcePosition = this.sourceConnector.getPosition();
    var targetPosition = {
      x: this.x,
      y: this.y
    };

    if (this.targetConnector) {
      targetPosition = this.targetConnector.getPosition();
    }

    var data = undefined;

    switch (FlowJS.Config.Link.Style) {
      case FlowJS.LinkStyle.Custom:
        data = FlowJS.PathTools.GetDataCustom(type, sourcePosition, targetPosition);
        break;
      case FlowJS.LinkStyle.Direct:
        data = FlowJS.PathTools.GetDataDirect(type, sourcePosition, targetPosition);
        break;
      case FlowJS.LinkStyle.Spline:
        data = FlowJS.PathTools.GetDataSpline(type, sourcePosition, targetPosition);      
        break;
    }

    if (FlowJS.Config.Link.Shadow.Enabled) {
      this.shadowElement.setAttribute('d', data);
    }

    this.element.setAttribute('d', data);

    if (this.enableEvents) {
      this.overlay.setAttribute('d', data);
    }
  }

  render() {
    this._renderShadow();
    this._renderElement();

    if (this.enableEvents) {
      this._renderOverlay();
    }
  }

  _renderShadow() {
    if (FlowJS.Config.Link.Shadow.Enabled) {
      var shadowThickness = FlowJS.Config.Link.Shadow.Thickness;
      var shadowOpacity = FlowJS.Config.Link.Shadow.Opacity;

      this.shadowElement = FlowJS.Tools.GenerateSVG('path');
      this.designer._linkContainer.appendChild(this.shadowElement);

      this.shadowElement.style.stroke = FlowJS.Config.Link.Shadow.Color || this.stroke;
      this.shadowElement.style.fill = 'none';
      this.shadowElement.style.strokeOpacity = shadowOpacity;
      this.shadowElement.style.strokeWidth = shadowThickness; 
    }
  }

  _renderElement() {
    var thickness = FlowJS.Config.Link.Thickness;

    this.element = FlowJS.Tools.GenerateSVG('path');
    this.designer._linkContainer.appendChild(this.element);

    this.element.style.stroke = this.stroke;
    this.element.style.fill = 'none';
    this.element.style.strokeWidth = thickness;
  }

  _renderOverlay() {
    var thickness = FlowJS.Config.Link.Thickness;    
    var shadowThickness = FlowJS.Config.Link.Shadow.Thickness;

    this.overlay = FlowJS.Tools.GenerateSVG('path');
    this.designer._linkContainer.appendChild(this.overlay);

    this.overlay.style.stroke = 'rgba(0,0,0,0)';
    this.overlay.style.fill = 'none';
    this.overlay.style.strokeWidth = Math.max(thickness + 2, shadowThickness);

    this.overlay.link = this;

    this.overlay.addEventListener('mouseover', (e) => {
      var link = e.target.link;
      var designer = link.designer;

      if (designer.activeMovementHandler != undefined) return;

      link.focus();

      link.designer.linkMovementHandler.currentLink = link;      
    });

    this.overlay.addEventListener('mouseout', (e) => {
      var link = e.target.link;

      link.unfocus();

      link.designer.linkMovementHandler.currentLink = undefined;

      link.designer.linkMovementHandler.focus();
    });

    this.overlay.addEventListener('mousedown', (e) => {
      var position = FlowJS.Tools.GetPosition(e);

      var link = e.target.link;
      var designer = link.designer;

      var activeLink = designer.linkMovementHandler.activeLink;
      if (activeLink == link) return;

      designer.linkMovementHandler.unfocus();

      designer.linkMovementHandler.start(position);
    });
  }

  destroy() {
    if (FlowJS.Config.Link.Shadow.Enabled) {
      this.designer._linkContainer.removeChild(this.shadowElement);
    }

    this.designer._linkContainer.removeChild(this.element);

    if (this.enableEvents) {
      this.designer._linkContainer.removeChild(this.overlay);    
    }
  }
}