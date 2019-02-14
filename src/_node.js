"use strict";

class Node {

  constructor(data) {

    this.x = data.x || 0;
    this.y = data.y || 0;


    this.width = data.width || 175;
    this.height = data.height || 60;

    this.id = data.id || FlowJS.Tools.GenerateId(8);

    this.type = data.type || 'unknown';

    this.title = data.title;
    this.subtitle = data.subtitle;
    this.hint = data.hint;

    this.selected = false;
    this.initialX = 0;
    this.initialY = 0;

    this.data = data || {};

    this.backgroundColor = data.backgroundColor || '#bfbfbf';
    this.foregroundColor = data.foregroundColor || '#000';
    this.borderColor = data.borderColor || '#909090';

    this.selectedBackgroundColor = data.selectedBackgroundColor || this.backgroundColor;
    this.selectedForegroundColor = data.selectedForegroundColor || this.foregroundColor; 
    this.selectedBorderColor = data.selectedBorderColor || 'orange';

    this.inputs = data.inputs || [];
    this.outputs = data.outputs || [];

    this.element = undefined;

    this.designer = undefined;
  }

  refresh() {
    // update text
    // update inputs
    // update outputs

    // update selection
    this.refreshBackground();

    // update size
    this.refreshPosition();
    this.refreshSize();
  }

  refreshBackground() {
    if (this.selected) {
      this.background.style.fill = this.selectedBackgroundColor;
      this.background.style.stroke = this.selectedBorderColor;
    } else {
      this.background.style.fill = this.backgroundColor;
      this.background.style.stroke = this.borderColor;
    }
  }

  refreshPosition() {
    this.element.setAttribute('transform', `translate(${this.x}, ${this.y})`);
  }

  refreshSize() {

  }

  export() {
    var node = {
      x: this.x,
      y: this.y,

      type: this.type,
      title: this.title,
      subtitle: this.subtitle,
      hint: this.hint,

      data: this.data,

      backgroundColor: this.backgroundColor,
      foregroundColor: this.foregroundColor,
      borderColor: this.borderColor,

      selectedBackgroundColor: this.selectedBackgroundColor,
      selectedForegroundColor: this.selectedForegroundColor,
      selectedBorderColor: this.selectedBorderColor,

      inputs: FlowJS.Tools.ExportCollection(this.inputs),
      outputs: FlowJS.Tools.ExportCollection(this.outputs),
    }

    return node;
  }

  render() {
    var minHeight = (Math.max(this.inputs.length, this.outputs.length) * 15) + 5;
    this.height = Math.max(minHeight, this.height);

    // container
    this.element = FlowJS.Tools.GenerateSVG('g', {
      'width': this.width,
      'height': this.height,
      'transform': `translate(${this.x}, ${this.y})`
    });

    this._renderBackground();

    this._renderTextArea();    

    this._renderMouseEventListener();

    this._renderInputs();

    this._renderOutputs();

    return this.element;
  }

  _renderBackground() {
    var backgroundRectangle = FlowJS.Tools.GenerateSVG('rect', {
      'width': this.width,
      'height': this.height,
      'x': 0,
      'y': 0,
      'rx': 5,
      'ry': 5,
    });
    this.element.appendChild(backgroundRectangle);

    this.background = backgroundRectangle;

    backgroundRectangle.style.strokeWidth = FlowJS.Config.Node.Thickness + 'px';
    backgroundRectangle.style.fill = this.backgroundColor;
    backgroundRectangle.style.stroke = this.borderColor;
  }

  _renderTextArea() {
    // text clipping area
    var clippingId = this.id;

    var clippingArea = FlowJS.Tools.GenerateSVG('clipPath', {
      'id': clippingId
    });
    this.element.appendChild(clippingArea);

    var clippingRectangle = FlowJS.Tools.GenerateSVG('rect', {
      'x': 10,
      'y': 0,
      'width': this.width - 20,
      'height': this.height  
    });
    clippingArea.appendChild(clippingRectangle);

    // text container
    var textArea = FlowJS.Tools.GenerateSVG('g', {
      'clip-path': `url(#${clippingId})`
    });
    this.element.appendChild(textArea);

    // title
    var titleText = FlowJS.Tools.GenerateSVG('text', {
      'x': 10,
      'y': 20,
      'font-size': FlowJS.Config.Font.Size,
      'font-weight': 'bold',
      'color': 'blue'
    });
    textArea.appendChild(titleText);

    titleText.innerHTML = this.title;

    // subtitle
    var subtitleText = FlowJS.Tools.GenerateSVG('text', {
      'x': 10,
      'y': 20 + FlowJS.Config.Font.Size,
      'font-size': FlowJS.Config.Font.Size,
    });
    textArea.appendChild(subtitleText);

    subtitleText.innerHTML = this.subtitle;
  }

  _renderMouseEventListener() {
    var actionArea = FlowJS.Tools.GenerateSVG('rect', {
      'x': 0,
      'y': 0,      
      'width': this.width,
      'height': this.height,
      'cursor': FlowJS.Config.Node.Cursor
    });
    this.element.appendChild(actionArea);

    actionArea.style.fill = 'rgba(0,0,0,0)';
    actionArea.node = this;
    actionArea.designer = this.designer;

    actionArea.addEventListener('mousedown', (e) => {
      var position = FlowJS.Tools.GetPosition(e);
      var designer = e.target.designer;
      var node = e.target.node;

      designer.nodeMovementHandler.activeNode = node;
      designer.nodeMovementHandler.keepSelected = node.selected;

      if (node.selected == false) {
        designer.nodeMovementHandler.setSelection([ node ]);
      }

      designer.nodeMovementHandler.start(position);
      FlowJS.Tools.BringToFront(designer._nodeContainer, node.element);      
    });
  }

  _renderInputs() {
    for (var i = 0; i < this.inputs.length; i++) {
      var connection = this.inputs[i];

      connection.node = this;
      connection.designer = this.designer;
      connection.type = FlowJS.ConnectorType.Input;

      var connectionElement = connection.render();
      this.element.appendChild(connectionElement);

      connection.offsetX = 0;
      connection.offsetY = 10 + (i * 15);

      connectionElement.setAttribute('x', -5);
      connectionElement.setAttribute('y', 5 + (i * 15));

      this.designer.registerConnection(connection);      
    }
  }

  _renderOutputs() {
    for (var i = 0; i < this.outputs.length; i++) {
      var connection = this.outputs[i];

      connection.node = this;
      connection.designer = this.designer;
      connection.type = FlowJS.ConnectorType.Output;

      var connectionElement = connection.render();
      this.element.appendChild(connectionElement);

      connection.offsetX = this.width;
      connection.offsetY = 10 + (i * 15);

      connectionElement.setAttribute('x', this.width - 5);
      connectionElement.setAttribute('y', 5 + (i * 15));

      this.designer.registerConnection(connection);
    }
  }

  inRectangle(xi, yi, xf, yf) {
    var centerX = this.x + (this.width / 2);
    var cetnerY = this.y + (this.height / 2)
    return (centerX >= xi && cetnerY >= yi && centerX <= xf && cetnerY <= yf);
  }
}