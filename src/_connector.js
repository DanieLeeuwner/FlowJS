class Connector {

  constructor(data) {

    this.id = data.id || FlowJS.Tools.GenerateId(4);

    this.offsetX = 0;
    this.offsetY = 0;

    this.name = data.name || data;

    this.type = FlowJS.ConnectorType.None;

    this.element = undefined;
    this.connector = undefined;
    this.nameText = undefined;

    this.selected = false;

    this.node = undefined;
    this.designer = undefined;
  }

  export() {
    var connector = {
      id: this.id,
      hint: this.hint,
      name: this.name,
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

    this.element = FlowJS.Tools.GenerateSVG('g');

    this.connector = FlowJS.Tools.GenerateSVG('rect', {
      'width': 10,
      'height': 10,
      'rx': rx,
      'ry': ry,
      'cursor': FlowJS.Config.Connector.Cursor,
    });
    this.element.appendChild(this.connector);

    this.connector.connector = this;

    this.connector.style.fill = connectorFill;
    this.connector.style.stroke = this.node.borderColor;
    this.connector.style.strokeWidth = FlowJS.Config.Node.Thickness + 'px';

    this.connector.addEventListener('mouseover', function(e) {
      var connector = e.target.connector;
      connector.focus();

      if (connector.selected) return;

      var designer = connector.designer;
      designer.connectorMovementHandler.finalConnector = connector;
    });

    this.connector.addEventListener('mouseout', function(e) {
      var connector = e.target.connector;
      connector.unfocus();

      var designer = connector.designer;

      designer.connectorMovementHandler.finalConnector = undefined;
    });

    this.connector.addEventListener('mousedown', function(e) {
      var connector = e.target.connector;
      connector.selected = true;

      var position = FlowJS.Tools.GetPosition(e);
      var designer = connector.designer;

      designer.connectorMovementHandler.initialConnector = connector;
      designer.connectorMovementHandler.start(position);
    })

    this.connector.addEventListener('mousedown', function(e) {
      var connector = e.target.connector;
      var designer = connector.designer;
      var initialConnector = designer.connectorMovementHandler.initialConnector;

      if (connector.selected || connector.type == initialConnector.type || connector.node.id == initialConnector.node.id) {
        designer.connectorMovementHandler.finalConnector = undefined;
      } else {
        designer.connectorMovementHandler.finalConnector = connector;
      }
    });

    if (this.name != undefined && this.name != '') {
      this.nameText = FlowJS.Tools.GenerateSVG('text', {
        'font-size': FlowJS.Config.Font.Size,
        'opacity': 0.1
      });
      this.element.appendChild(this.nameText);

      this.nameText.style.pointerEvents = 'none';
      this.nameText.innerHTML = this.name;

      var x = 0;
      var y = 8;

      switch (this.type) {
        case FlowJS.ConnectorType.Input:
          x = 12;
          y = 8;
          break;
        case FlowJS.ConnectorType.Output:
          let fontDefinintion = 'normal ' + FlowJS.Config.Font.Size + 'px ' + FlowJS.Config.Font.Family;
          x = (FlowJS.Tools.MeasureText(this.name, fontDefinintion) * -1) - 2;
          y = 8;
          break;
      }

      this.nameText.setAttribute('x', x);
      this.nameText.setAttribute('y', y);
    }

    return this.element;
  }

  focus() {
    this.connector.style.stroke = this.designer.theme.Focus;
    this.nameText.setAttribute('opacity', 0.8);

    this.node.blur();
  }

  unfocus() {
    if (this.selected) return;

    this.connector.style.stroke = this.node.borderColor;
    this.nameText.setAttribute('opacity', 0.1);

    this.node.unblur();
  }
}