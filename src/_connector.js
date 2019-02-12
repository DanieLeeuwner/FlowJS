"use strict";

class Connector {

  constructor(data) {

    this.id = data.id || FlowJS.Tools.GenerateId(4);

    this.hint = data.hint;

    this.type = data.type || FlowJS.ConnectorType.None;

    this.element = undefined;

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

  render() {
    var rx = 0;
    var ry = 0;

    switch (FlowJS.Config.ConnectorStyle) {
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
    if (FlowJS.Config.ConnectorFill) {
      connectorFill = this.node.borderColor;
    }

    var connection = FlowJS.Tools.GenerateSVG('rect', {
      'width': 10,
      'height': 10,
      'rx': rx,
      'ry': ry,
      'cursor': FlowJS.Config.ConnectorCursor,
    });
    connection.element = this;

    connection.style.fill = connectorFill;
    connection.style.stroke = this.node.borderColor;
    connection.style.strokeWidth = FlowJS.Config.NodeBorderThickness + 'px';

    connection.addEventListener('mouseover', function(e) {
      e.target.style.stroke = e.target.element.node.selectedBorderColor;
      e.target.element.designer.activeConnector = e.target.element;
    });

    connection.addEventListener('mouseout', function(e) {
      e.target.style.stroke = e.target.element.node.borderColor;
      e.target.element.designer.activeConnector = undefined;
    });
    
    return connection;
  }
}