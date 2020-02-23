class Node {

  constructor(data) {

    this.x = data.x || 0;
    this.y = data.y || 0;

    this.width = data.width || 225;
    this.height = data.height || 45;

    this.image = data.image;

    this.id = data.id || FlowJS.Tools.GenerateId(8);

    this.type = data.type || 'unknown';

    this.code = data.code;
    this.name = data.name;
    this.description = data.description;
    this.hint = data.hint;

    this.hideText = data.hideText;

    this.deprecated = data.deprecated;
    this.deprecationMessage = data.deprecationMessage;

    this.selected = false;
    this.initialX = 0;
    this.initialY = 0;

    this.horizontalMargin = 45;

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

    this.designer = data.designer;
  }

  refresh() {
    if (!this.hideText) {
      // update text
      this.refreshText();
    }

    // update image
    this.refreshImage();

    // update selection
    this.refreshBackground();

    // update size
    this.refreshPosition(true);
    this.refreshSize();
  }

  refreshText() {
    this.nameText.innerHTML = '';

    let textLines = [];
    let availableWidth = this.width - this.horizontalMargin - 15;
    let nameWords = this.name.split(' ');

    let fontDefinition = 'normal ' + FlowJS.Config.Font.Size + 'px ' + FlowJS.Config.Font.Family;

    let currentLine = '';

    for (let index = 0; index < nameWords.length; index++) {
      let word = nameWords[index];

      let pendingLine = currentLine + ' ' + word;
      let pendingWidth = FlowJS.Tools.MeasureText(pendingLine, fontDefinition);
      if (pendingWidth > availableWidth) {
        textLines.push(currentLine);
        currentLine = word;
      } else if (index == nameWords.length - 1) {
        textLines.push(pendingLine);
      } else {
        currentLine = pendingLine;
      }
    }

    let textLineLength = (textLines.length * (FlowJS.Config.Font.Size + 2)) + 15;
    let maxConnectorCount = Math.max(this.inputs.length, this.outputs.length);
    let connectorMaxLength = Math.max(this.height, (maxConnectorCount * 15) + 5);
    this.height = Math.max(connectorMaxLength, textLineLength);

    let firstElement = true;

    for (let line of textLines) {
      var tspan = FlowJS.Tools.GenerateSVG('tspan', {
        'x': this.horizontalMargin,
        'dy': firstElement ? 0 : (FlowJS.Config.Font.Size + 2)
      });
      this.nameText.appendChild(tspan);
      tspan.innerHTML = line;

      firstElement = false;
    }
  }

  refreshImage() {
    if (!this.image) {
      return;
    }

    this.imageArea.setAttribute('href', this.image);
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

  refreshPosition(performSnapping) {
    if (performSnapping && FlowJS.Config.Grid.Snap) {
      this.x = Math.round(this.x / FlowJS.Config.Grid.Size) * FlowJS.Config.Grid.Size;
      this.y = Math.round(this.y / FlowJS.Config.Grid.Size) * FlowJS.Config.Grid.Size;
    }

    this.element.setAttribute('transform', `translate(${this.x}, ${this.y})`);
  }

  refreshSize() {
    this.element.setAttribute('width', this.width);
    this.element.setAttribute('height', this.height);

    this.background.setAttribute('width', this.width);
    this.background.setAttribute('height', this.height);

    this.actionArea.setAttribute('width', this.width);
    this.actionArea.setAttribute('height', this.height);

    if (!this.hideText) {
      this.clippingRectangle.setAttribute('width', this.width - this.horizontalMargin - 15);
      this.clippingRectangle.setAttribute('height', this.height);
    }
  }

  export() {
    var node = {
      id: this.id,

      x: this.x,
      y: this.y,

      type: this.type,
      code: this.code,
      name: this.name,
      description: this.description,
      hint: this.hint,
      image: this.image,

      hideText: this.hideText,

      data: this.data,

      backgroundColor: this.backgroundColor,
      foregroundColor: this.foregroundColor,
      borderColor: this.borderColor,

      width: this.width,
      height: this.height,

      inputs: FlowJS.Tools.ExportCollection(this.inputs),
      outputs: FlowJS.Tools.ExportCollection(this.outputs),
    }

    return node;
  }

  render() {
    // container
    this.element = FlowJS.Tools.GenerateSVG('g', {
      'transform': `translate(${this.x}, ${this.y})`,
    });

    this._renderBackground();

    this._renderBlurArea();

    if (!this.hideText) {
      this._renderTextArea();
    }

    this._renderImage();

    this._renderMouseEventListener();

    this._renderInputs();

    this._renderOutputs();

    this.refresh();

    return this.element;
  }

  _renderBackground() {
    this.background = FlowJS.Tools.GenerateSVG('rect', {
      'x': 0,
      'y': 0,
      'rx': 5,
      'ry': 5
    });
    this.element.appendChild(this.background);
  }

  _renderBlurArea() {
    this._blurFilterId = FlowJS.Tools.GenerateId(12);

    var defs = FlowJS.Tools.GenerateSVG('defs');
    this.element.appendChild(defs);

    var filter = FlowJS.Tools.GenerateSVG('filter', {
      'id': this._blurFilterId
    });
    defs.appendChild(filter);

    var blurFilter = FlowJS.Tools.GenerateSVG('feGaussianBlur', {
      'in': 'SourceGraphic',
      'stdDeviation': 1
    });
    filter.appendChild(blurFilter);
  }

  _renderTextArea() {
    // text clipping area
    this._clippingId = FlowJS.Tools.GenerateId(12);

    var clippingArea = FlowJS.Tools.GenerateSVG('clipPath', {
      'id': this._clippingId
    });
    this.element.appendChild(clippingArea);

    this.clippingRectangle = FlowJS.Tools.GenerateSVG('rect', {
      'x': this.horizontalMargin,
      'y': 0
    });
    clippingArea.appendChild(this.clippingRectangle);

    // text container
    this.textArea = FlowJS.Tools.GenerateSVG('g', {
      'clip-path': `url(#${this._clippingId})`
    });
    this.element.appendChild(this.textArea);

    // name
    this.nameText = FlowJS.Tools.GenerateSVG('text', {
      'x': this.horizontalMargin,
      'y': 15,
      'font-size': FlowJS.Config.Font.Size,
      'font-weight': 'bold'
    });
    this.textArea.appendChild(this.nameText);
  }

  _renderMouseEventListener() {
    this.actionArea = FlowJS.Tools.GenerateSVG('rect', {
      'x': 0,
      'y': 0,
      'cursor': FlowJS.Config.Node.Cursor
    });
    this.element.appendChild(this.actionArea);

    this.actionArea.style.fill = 'rgba(0,0,0,0)';
    this.actionArea.node = this;
    this.actionArea.designer = this.designer;

    this.actionArea.addEventListener('mousedown', (e) => {
      if (e.button != 0) {
        return;
      }

      var position = FlowJS.Tools.GetPosition(e);
      var designer = e.target.designer;
      var node = e.target.node;

      designer.nodeMovementHandler.activeNode = node;
      designer.nodeMovementHandler.keepSelected = node.selected;

      var currentNodes = designer.nodeMovementHandler.nodes;
      if (e.shiftKey == false && (currentNodes.length > 1 || (currentNodes.length == 1 && currentNodes[0] != node))) {

      }

      if (node.selected == false) {
        var nodes = designer.nodeMovementHandler.nodes;
        if (e.shiftKey) {
          nodes.push(node);
        } else {
          nodes = [ node ];
        }
        designer.nodeMovementHandler.setSelection(nodes);
        designer.nodeMovementHandler.keepSelected = e.shiftKey;
      }

      designer.nodeMovementHandler.start(position);
      FlowJS.Tools.BringToFront(designer._nodeContainer, node.element);
    });
  }

  _renderImage() {
    this.imageArea = FlowJS.Tools.GenerateSVG('image', {
      'x': 5,
      'y': 5,
      'width': 35,
      'height': 35
    });
    this.element.appendChild(this.imageArea);
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
    for (let i = 0; i < this.outputs.length; i++) {
      let connection = this.outputs[i];

      connection.node = this;
      connection.designer = this.designer;
      connection.type = FlowJS.ConnectorType.Output;

      let connectionElement = connection.render();
      this.element.appendChild(connectionElement);

      connection.offsetX = this.width;
      connection.offsetY = 10 + (i * 15);

      let x = this.width - 5;
      let y = 5 + (i * 15);

      connectionElement.setAttribute('transform', `translate(${x}, ${y})`);
    }
  }

  inRectangle(xi, yi, xf, yf) {
    let centerX = this.x + (this.width / 2);
    let cetnerY = this.y + (this.height / 2)
    return (centerX >= xi && cetnerY >= yi && centerX <= xf && cetnerY <= yf);
  }

  getConnector(id) {
    for (let i = 0; i < this.inputs.length; i++) {
      if (this.inputs[i].id == id) {
        return this.inputs[i];
      }
    }

    for (let i = 0; i < this.outputs.length; i++) {
      if (this.outputs[i].id == id) {
        return this.outputs[i];
      }
    }
  }

  destroy() {
    this.designer._nodeContainer.removeChild(this.element);
  }

  blur() {
    if (!this.hideText) {
      this.textArea.setAttribute('filter', `url(#${this._blurFilterId})`);
      this.textArea.style.opacity = 0.1;
    }

    this.imageArea.setAttribute('filter', `url(#${this._blurFilterId})`);
    this.imageArea.style.opacity = 0.5;
  }

  unblur() {
    if (!this.hideText) {
      this.textArea.removeAttribute('filter');
      this.textArea.style.opacity = 1;
    }

    this.imageArea.removeAttribute('filter');
    this.imageArea.style.opacity = 1;
  }
}