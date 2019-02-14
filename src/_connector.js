"use strict";

class Connector {

  constructor(data) {

    this.id = data.id || FlowJS.Tools.GenerateId(4);

    this.offsetX = 0;
    this.offsetY = 0;

    this.hint = data.hint;

    this.type = FlowJS.ConnectorType.None;

    this.element = undefined;

    this.selected = false;

    this.node = undefined;
    this.designer = undefined;
  }

  export() {
    var connector = {
      id: this.id,
      hint: this.hint,
      type: this.type
    }

    return connector;
  }

  getId() {
    var id = this.node.id + '.' + this.id;
    return id;
  }

  getPosition() {
    return {
      x: this.node.x + this.offsetX,
      y: this.node.y + this.offsetY,
    }
  }

  render() {
    var rx = 0;
    var ry = 0;

    switch (FlowJS.Config.Connector.Style) {
      case FlowJS.ConnectorStyle.Round:
        rx = 5;
        ry = 5;
        break;
      case FlowJS.ConnectorStyle.Square:
        rx = 2;
        ry = 2;
        break;
    }

    var connectorFill = this.designer.theme.ConnectorFill;
    if (FlowJS.Config.Connector.Fill) {
      connectorFill = this.node.borderColor;
    }

    this.element = FlowJS.Tools.GenerateSVG('rect', {
      'width': 10,
      'height': 10,
      'rx': rx,
      'ry': ry,
      'cursor': FlowJS.Config.Connector.Cursor,
    });
    this.element.connector = this;

    this.element.style.fill = connectorFill;
    this.element.style.stroke = this.node.borderColor;
    this.element.style.strokeWidth = FlowJS.Config.Node.Thickness + 'px';

    this.element.addEventListener('mouseover', function(e) {
      var connector = e.target.connector;
      connector.focus();

      if (connector.selected) return;

      var designer = connector.designer;
      designer.connectorMovementHandler.finalConnector = connector;      
    });

    this.element.addEventListener('mouseout', function(e) {
      var connector = e.target.connector;
      connector.unfocus();
    });

    this.element.addEventListener('mousedown', function(e) {
      var connector = e.target.connector;
      connector.selected = true;

      var position = FlowJS.Tools.GetPosition(e);
      var designer = connector.designer;

      designer.connectorMovementHandler.initialConnector = connector;
      designer.connectorMovementHandler.start(position);
    })

    this.element.addEventListener('mousedown', function(e) {
      var connector = e.target.connector;
      var initialConnector = designer.connectorMovementHandler.initialConnector;
      if (connector.selected || connector.type == initialConnector.type || connector.node.id == initialConnector.node.id) {
        designer.connectorMovementHandler.finalConnector = undefined;
      } else {
        designer.connectorMovementHandler.finalConnector = connector;
      }
    });

    return this.element;
  }

  focus() {
    this.element.style.stroke = this.node.selectedBorderColor;
  }

  unfocus() {
    if (this.selected) return;

    this.element.style.stroke = this.node.borderColor;
  }
}