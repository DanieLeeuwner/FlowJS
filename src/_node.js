"use strict";

class Node {

  constructor(data) {

    this.x = data.x || 0;
    this.y = data.y || 0;


    this.width = data.width || 225;
    this.height = data.height || 60;

    this.id = data.id || FlowJS.Tools.GenerateId(8);

    this.type = data.type || 'unknown';

    this.title = data.title;
    this.subtitle = data.subtitle;

    this.selected = false;
    this.initialX = 0;
    this.initialY = 0;

    this.data = data.data || {};

    this.backgroundColor = data.backgroundColor || '#bfbfbf';
    this.foregroundColor = data.foregroundColor || '#000';
    this.borderColor = data.borderColor || '#909090';

    this.inputs = [];
    this.outputs = [];

    if (data.inputs) {
      for (var i = 0; i < data.inputs.length; i++) {
        this.inputs.push(new Connector(data.inputs[i]));
      }
    }

    if (data.outputs) {
      for (var i = 0; i < data.outputs.length; i++) {
        this.outputs.push(new Connector(data.outputs[i]));
      }
    }

    this.element = undefined;
    this.image

    this.designer = data.designer;
  }

  refresh() {
    // update text
    this.refreshText();

    // update image
    this.refreshImage();

    // update selection
    this.refreshBackground();

    // update size
    this.refreshPosition();
    this.refreshSize();
  }

  refreshText() {
    this.titleText.innerHTML = this.title;
    this.subtitleText.innerHTML = this.subtitle;
  }

  refreshImage() {

  }

  refreshBackground() {
    this.background.style.strokeWidth = FlowJS.Config.Node.Thickness + 'px';
    this.background.style.fill = this.backgroundColor;

    if (this.selected) {
      this.background.style.stroke = this.designer.theme.Focus;
    } else {
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
      id: this.id,

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

    this.refresh();

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
  }

  _renderTextArea() {
    // text clipping area
    var clippingId = this.id;

    var clippingArea = FlowJS.Tools.GenerateSVG('clipPath', {
      'id': clippingId
    });
    this.element.appendChild(clippingArea);

    var horizontalMargin = 30;

    var clippingRectangle = FlowJS.Tools.GenerateSVG('rect', {
      'x': horizontalMargin,
      'y': 0,
      'width': this.width - horizontalMargin * 2,
      'height': this.height  
    });
    clippingArea.appendChild(clippingRectangle);

    // text container
    var textArea = FlowJS.Tools.GenerateSVG('g', {
      'clip-path': `url(#${clippingId})`
    });
    this.element.appendChild(textArea);

    // title
    this.titleText = FlowJS.Tools.GenerateSVG('text', {
      'x': horizontalMargin,
      'y': 20,
      'font-size': FlowJS.Config.Font.Size,
      'font-weight': 'bold',
      'color': 'blue'
    });
    textArea.appendChild(this.titleText);

    // subtitle
    this.subtitleText = FlowJS.Tools.GenerateSVG('text', {
      'x': horizontalMargin,
      'y': 20 + FlowJS.Config.Font.Size,
      'font-size': FlowJS.Config.Font.Size,
    });
    textArea.appendChild(this.subtitleText);

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

      var currentNodes = designer.nodeMovementHandler.nodes;
      if (e.ctrlKey == false && (currentNodes.length > 1 || (currentNodes.length == 1 && currentNodes[0] != node))) {
        if (designer.callbacks.nodeUnselected) {
          designer.callbacks.nodeUnselected(designer.nodeMovementHandler.nodes);
        }        
      }
      
      if (node.selected == false) {
        var nodes = designer.nodeMovementHandler.nodes;
        if (e.ctrlKey) {
          nodes.push(node);
        } else {
          nodes = [ node ];
        }
        designer.nodeMovementHandler.setSelection(nodes);
        designer.nodeMovementHandler.keepSelected = e.ctrlKey;
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

      var x = -5;
      var y = 5 + (i * 15);

      connectionElement.setAttribute('transform', `translate(${x}, ${y})`);
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

      var x = this.width - 5;
      var y = 5 + (i * 15);

      connectionElement.setAttribute('transform', `translate(${x}, ${y})`);
    }
  }

  setForeignContent(element) {

  }

  inRectangle(xi, yi, xf, yf) {
    var centerX = this.x + (this.width / 2);
    var cetnerY = this.y + (this.height / 2)
    return (centerX >= xi && cetnerY >= yi && centerX <= xf && cetnerY <= yf);
  }

  getConnector(id) {
    for (var i = 0; i < this.inputs.length; i++) {
      if (this.inputs[i].id == id) {
        return this.inputs[i];
      }
    }

    for (var i = 0; i < this.outputs.length; i++) {
      if (this.outputs[i].id == id) {
        return this.outputs[i];
      }
    }
  }

  destroy() {
    this.designer._nodeContainer.removeChild(this.element);
  }
}