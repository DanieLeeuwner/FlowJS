/*
Created by filepack
Date: Sunday, April 28, 2019
*/

/*
File: src/_tools.js
*/

var FlowJS = FlowJS || {};

FlowJS.Tools = {
  GenerateId: (length) => {
    var pattern = new Array(length + 1).join('x');
    return pattern.replace(/[x]/g, (c) => {
      var r = Math.random() * 16 | 0;
      return r.toString(16);
    });
  },

  ExportCollection: (data) => {
    var output = [];

    for (var i = 0; i < data.length; i++) {
      output.push(data[i].export());
    }

    return output;
  },

  GenerateSVG: (type, attributes) => {
    var element = document.createElementNS('http://www.w3.org/2000/svg', type);
    for (var i in attributes) {
      element.setAttribute(i, attributes[i]);
    }
    return element;
  },

  _containerStyle: undefined,

  ContainerStyle: () => {
    if (FlowJS.Tools._containerStyle) {
      return FlowJS.Tools._containerStyle;
    }

    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML =
     `.FlowJS_Container {
        -webkit-touch-callout: none;
          -webkit-user-select: none;
           -khtml-user-select: none;
             -moz-user-select: none;
              -ms-user-select: none;
                  user-select: none;
      }

      .FlowJS_Container:focus {
        outline: 0;
      }
      `;
    document.getElementsByTagName('head')[0].appendChild(style);

    FlowJS.Tools._containerStyle = 'FlowJS_Container';

    return FlowJS.Tools._containerStyle;
  },

  GetDesigner: (e) => {
    var i = 0;
    while (i < e.path.length && e.path[i].designer == undefined) {
      i++;
    }

    if (i == e.path.length) return undefined;
    return e.path[i].designer;
  },

  GetPosition: (e) => {
    var designer = FlowJS.Tools.GetDesigner(e);
    if (designer == undefined) return;

    var x = e.offsetX;
    var y = e.offsetY;

    x /= designer.scale;
    y /= designer.scale;

    var dx = designer.initialX - x;
    var dy = designer.initialY - y;

    return {
      x: x,
      y: y,
      dx: dx,
      dy: dy,
      designer: designer,
      e: e
    }
  },

  SelectRandom: (items) => {
    return items[Math.floor(Math.random() * items.length)];
  },

  BringToFront: (container, element) => {
    container.removeChild(element);
    container.appendChild(element);
  },

  MeasureText: (text, font) => {
    var canvas = FlowJS.Tools.MeasureText.canvas || (FlowJS.Tools.MeasureText.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
  }
}

/*
File: src/_path.js
*/

var FlowJS = FlowJS || {};

FlowJS.PathTools = {

  _getBasePoints: (type, initialPosition, finalPosition) => {
    var x1 = 0;
    var x2 = 0;
    var x3 = 0;
    var x4 = 0;

    var y1 = 0;
    var y2 = 0;

    if (type == FlowJS.ConnectorType.Output) {
      x1 = initialPosition.x;
      x2 = initialPosition.x + FlowJS.Config.Link.InitialLength;
      y1 = initialPosition.y;

      x3 = finalPosition.x - FlowJS.Config.Link.InitialLength;
      x4 = finalPosition.x;
      y2 = finalPosition.y;      
    } else {

      x1 = finalPosition.x;
      x2 = finalPosition.x + FlowJS.Config.Link.InitialLength;
      y1 = finalPosition.y;  

      x3 = initialPosition.x - FlowJS.Config.Link.InitialLength;
      x4 = initialPosition.x;
      y2 = initialPosition.y;
    }

    return {
      x1: x1,
      x2: x2,
      x3: x3,
      x4: x4,
      y1: y1,
      y2: y2
    }
  },

  CustomDataFunction: undefined,

  GetDataCustom: (type, initialPosition, finalPosition) => {
    if (FlowJS.PathTools.CustomDataFunction) {
      return CustomDataFunction(type, initialPosition, finalPosition);
    }

    return FlowJS.PathTools.GetDataDirect(type, initialPosition, finalPosition);
  },

  GetDataDirect: (type, initialPosition, finalPosition) => {
    var points = FlowJS.PathTools._getBasePoints(type, initialPosition, finalPosition);

    var data = `M${points.x1} ${points.y1} L${points.x2} ${points.y1} ${points.x3} ${points.y2} ${points.x4} ${points.y2}`;
    return data;
  },

  GetDataSpline: (type, initialPosition, finalPosition) => {

    var points = FlowJS.PathTools._getBasePoints(type, initialPosition, finalPosition);

    var halfX = (points.x2 + points.x3) / 2;
    var halfY = (points.y1 + points.y2) / 2;

    var data = `M${points.x1} ${points.y1}`;
    data += `Q${points.x2 + (FlowJS.Config.Link.InitialLength * 2)} ${points.y1} ${halfX} ${halfY}`;
    data += `M${points.x4} ${points.y2}`;
    data += `Q${points.x3 - (FlowJS.Config.Link.InitialLength * 2)} ${points.y2} ${halfX} ${halfY}`;
    return data;
  },
}

/*
File: src/_config.js
*/

var FlowJS = FlowJS || {};

FlowJS.ConnectorStyle = {
  Square: 'Square',
  Round: 'Round',
}

FlowJS.ConnectorType = {
  None: 'None',
  Input: 'Input',
  Output: 'Output',
}

FlowJS.GridStyle = {
  None: 'None',
  Line: 'Line',
  Dot: 'Dot',
}

FlowJS.LinkStyle = {
  Custom: 'Custom',
  Direct: 'Direct',
  Spline: 'Spline',
}

FlowJS.Config = {
  Grid: {
    Style: FlowJS.GridStyle.Line,
    Thickness: 2,
    Enabled: true,
    Size: 20,
    Snap: true,
    Cursor: 'crosshair',
  },

  Node: {
    Thickness: 2,
    Cursor: 'crosshair',
  },

  Connector: {
    Style: FlowJS.ConnectorStyle.Square,
    Fill: false,
    Cursor: 'crosshair'
  },

  Link: {
    Style: FlowJS.LinkStyle.Spline,

    Thickness: 3,
    InitialLength: 20,
    Angle: 45,

    Shadow: {
      Enabled: true,
      Thickness: 8,
      Opacity: 0.2,
      Color: false,
    }
  },

  Scale: {
    Minimum: 0.25,
    Maximum: 1.5,
  },

  Controls: {
    Enabled: true,
  },

  Font: {
    Family: '"Lucida Console", Monaco, monospace',
    Size: 14,
  }
}

/*
File: src/_theme.js
*/

var FlowJS = FlowJS || {};

FlowJS.Palette = {
  Pastel: [
    '#FF8B8B',
    '#FFBC6E',
    '#F5FFA2',
    '#AAFFA2',
    '#9FD1FF',
    '#FFAEF7',
  ],

  Vibrant: [
    '#FF0000',
    '#FF8100',
    '#FFF400',
    '#22FF00',
    '#0045FF',
    '#FF00E7',
  ],

  DefaultLight: [
    '#333',
  ],

  DefaultDark: [
    '#CCC',
  ],
}

FlowJS.Theme = {
  Light: {
    Grid: '#CCC',
    Background: '#FFF',
    Focus: 'orange',
    SelectionBorder: 'rgba(100, 100, 100, 0.8)',
    SelectionFill: 'rgba(100, 100, 100, 0.2)',
    Link: FlowJS.Palette.DefaultLight,
    ConnectorBorder: '#000',
    ConnectorFill: '#FFF',
    Watermark: 'rgba(51, 51, 51, 0.2)',
  },
  Dark: {
    Grid: '#333',
    Background: '#222',
    Focus: 'orange',
    SelectionBorder: 'rgba(200, 200, 200, 0.8)',
    SelectionFill: 'rgba(200, 200, 200, 0.2)',
    Link: FlowJS.Palette.DefaultDark,
    ConnectorBorder: '#DDD',
    ConnectorFill: '#FFF',
    Watermark: 'rgba(175, 175, 175, 0.2)',
  },
}


/*
File: src/_movement.js
*/

"use strict";

var FlowJS = FlowJS || {};

FlowJS.Movement = {
  MouseDown: (e) => {
    if (e.button != 0)
    {
      // todo: context menu actions
      return;
    }

    var position = FlowJS.Tools.GetPosition(e);
    if (position == undefined) {
      FlowJS.Input.UnfocusDesigner();
      return;
    }

    var designer = position.designer;
    FlowJS.Input.FocusDesigner(designer);

    designer.initialX = position.x;
    designer.initialY = position.y;

    if (e.ctrlKey) {
      // drag designer view
      designer.designerMovementHandler.start(position);
    } else {
      // selection rectangle
      if (e.target.isBackground) {
        designer.selectionMovementHandler.start(position);
      }
    }
  },

  MouseMove: (e) => {
    var position = FlowJS.Tools.GetPosition(e);
    if (position == undefined) return;

    var designer = position.designer;

    if (designer.activeMovementHandler == undefined) return;
    if (designer.activeMovementHandler.active == false) return;

    designer.activeMovementHandler.update(position);
  },

  MouseUp: (e) => {
    var position = FlowJS.Tools.GetPosition(e) || {};

    var designer = FlowJS.Input.ActiveDesigner;
    if (designer == undefined) return;

    position.designer = designer;

    if (designer.activeMovementHandler == undefined) return;
    if (designer.activeMovementHandler.active == false) return;

    designer.activeMovementHandler.stop(position);
  },

  MouseWheel: (e) => {
    if (e.ctrlKey == false)
    {
      return;
    }

    var position = FlowJS.Tools.GetPosition(e);
    e.preventDefault();

    // update zoom
    var increment = 0.1;
    var ds = (e.deltaY < 0 ? 1 : -1) * increment;
    var initialScale = position.designer.scale;
    position.designer.scale += ds;

    // refresh designer
    position.designer.refresh();

    ds = position.designer.scale - initialScale;

    var dx = position.designer.designContainer.scrollLeft + (position.x * ds);
    var dy = position.designer.designContainer.scrollTop + (position.y * ds);

    position.designer.designContainer.scrollTo(dx, dy);
  }
}

class MovementHandler {
  constructor(designer) {
    this.designer = designer;

    this.initialX = 0;
    this.initialY = 0;

    this.active = false;
  }

  start(position) {
    if (this.designer.activeMovementHandler != undefined) {
      if (this.designer.activeMovementHandler != this) {
        if (this.designer.activeMovementHandler.active) {
          this.designer.activeMovementHandler.stop(position);
        }
        this.designer.activeMovementHandler.reset();
      }
    }

    this.designer.activeMovementHandler = this;

    this.initialX = position.x;
    this.initialY = position.y;

    this.active = true;
  }

  update(position) {
  }

  stop(position) {
    this.active = false;
  }

  reset() {
  }
}

/*
File: src/_movement.selection.js
*/

"use strict";

class SelectionMovementHandler extends MovementHandler {
  constructor(designer) {
    super(designer);

    this.element = undefined;
  }

  start(position) {
    this.designer.callbacks.invokeNodeUnselected(this.designer.nodeMovementHandler.nodes);

    super.start(position);

    this.element = FlowJS.Tools.GenerateSVG('rect');
    this.designer._svg.appendChild(this.element);

    this.element.style.fill = this.designer.theme.SelectionFill;
    this.element.style.stroke = this.designer.theme.SelectionBorder;
    this.element.style.strokeWidth = '0.5px';
  }

  update(position) {
    super.update(position);

    var x = Math.min(position.x, this.initialX);
    var y = Math.min(position.y, this.initialY);

    var width = Math.abs(position.dx);
    var height = Math.abs(position.dy);

    this.element.setAttribute('transform', `translate(${x * this.designer.scale},${y * this.designer.scale})`);
    this.element.setAttribute('width', width * this.designer.scale);
    this.element.setAttribute('height', height * this.designer.scale);

    this.designer.nodeMovementHandler.updateNodes(x, y, x + width, y + height);
  }

  stop(position) {
    super.stop(position);

    if (position.dx == 0 && position.dy == 0) {
      this.designer.nodeMovementHandler.setSelection();
    } else {
      this.designer.callbacks.invokeNodeSelected(this.designer.nodeMovementHandler.nodes);
    }

    this.designer._svg.removeChild(this.element);
    this.element = undefined;

    this.designer.activeMovementHandler = this.designer.nodeMovementHandler;
  }
}

/*
File: src/_movement.designer.js
*/

"use strict";

class DesignerMovementHandler extends MovementHandler {
  constructor(designer) {
    super(designer);

    this.absolute = true;
  }

  start(position) {
    super.start(position);

    this.initialX = position.e.pageX;
    this.initialY = position.e.pageY;

    this.initialScrollX = this.designer.designContainer.scrollLeft;
    this.initialScrollY = this.designer.designContainer.scrollTop;
  }

  update(position) {
    super.update(position);

    var dx = position.e.pageX - this.initialX;
    var dy = position.e.pageY - this.initialY;

    var scrollX = this.initialScrollX - dx;
    var scrollY = this.initialScrollY - dy;

    this.designer.designContainer.scrollTo(scrollX, scrollY);
  }

  stop(position) {
    super.stop(position);

    this.designer.activeMovementHandler = this.designer.nodeMovementHandler;
  }
}

/*
File: src/_movement.node.js
*/

"use strict";

class NodeMovementHandler extends MovementHandler {
  constructor(designer) {
    super(designer);

    this.nodes = [];

    this.activeNode = undefined;
    this.keepSelected = false;
  }

  updateNodes(xi, yi, xf, yf) {
    var nodes = [];

    for (var i = 0; i < this.designer.nodes.length; i++) {
      var node = this.designer.nodes[i];

      if (node.inRectangle(xi, yi, xf, yf)) {
        nodes.push(node);
      }
    }

    this.setSelection(nodes);
  }

  setSelection(nodes) {
    this.nodes = nodes || [];

    for (var i = 0; i < this.designer.nodes.length; i++) {
      var node = this.designer.nodes[i];
      node.selected = (this.nodes.indexOf(node) != -1);
    }
    this.designer.refreshNodeSelectionStates();
  }

  start(position) {
    super.start(position);

    for (var i = 0; i < this.nodes.length; i++) {
      var node = this.nodes[i];
      node.initialX = node.x;
      node.initialY = node.y;

      FlowJS.Tools.BringToFront(this.designer._nodeContainer, node.element);
    }
  }

  update(position) {
    super.update(position);

    for (var i = 0; i < this.nodes.length; i++) {
      var node = this.nodes[i];

      var x = node.initialX - position.dx;
      var y = node.initialY - position.dy;

      if (x < 0) x = 0;
      if (y < 0) y = 0;

      if (x + node.width > this.designer.width) x = this.designer.width - node.width;
      if (y + node.height > this.designer.height) y = this.designer.height - node.height;

      node.x = x;
      node.y = y;
      node.refreshPosition();
    }

    this.designer.refreshNodeLinks(this.nodes);
  }

  stop(position) {
    super.stop(position);

    if (position.dx == 0 && position.dy == 0) {
      if (this.keepSelected == false) {
        this.setSelection([ this.activeNode ]);
        this.designer.callbacks.invokeNodeSelected([ this.activeNode ]);
      } else {
        this.designer.callbacks.invokeNodeOpened(this.activeNode);
      }
    } else {
      this.designer.callbacks.invokeNodeMoved(this.nodes);
      for (var i = 0; i < this.nodes.length; i++) {
        var node = this.nodes[i];

        node.refreshPosition(true);

        if (this.keepSelected == false) {
          node.selected = false;
          node.refreshBackground();
        }
      }

      this.designer.refreshNodeLinks(this.nodes);

      if (this.keepSelected == false) {
        this.nodes = [];
      }
    }

    this.activeNode = undefined;
  }

  reset() {
    this.setSelection();
  }
}


/*
File: src/_movement.connector.js
*/

"use strict";

class ConnectorMovementHandler extends MovementHandler {
  constructor(designer) {
    super(designer);

    this.initialConnector = undefined;
    this.finalConnector = undefined;

    this.link = undefined;
  }

  start(position) {
    super.start(position);

    this.designer.nodeMovementHandler.setSelection();
    this.designer.linkMovementHandler.unfocus();

    this.link = new Link(undefined, undefined, {
      designer: this.designer,
      sourceConnector: this.initialConnector,
      stroke: FlowJS.Tools.SelectRandom(this.designer.theme.Link),
      enableEvents: false,
      x: position.x,
      y: position.y
    });

    this.link.render();
    this.link.refresh();
  }

  update(position) {
    super.update(position);

    this.link.x = position.x;
    this.link.y = position.y;

    this.link.refresh();
  }

  stop(position) {
    super.stop(position);

    this.link.destroy();

    if (this.finalConnector) {
      var source = this.initialConnector.type == FlowJS.ConnectorType.Output ? this.initialConnector : this.finalConnector;
      var target = this.initialConnector.type == FlowJS.ConnectorType.Input ? this.initialConnector : this.finalConnector;

      if (source.node != target.node && source.type != target.type) {
        if (this.designer.validation.invokeLinkCreate(source, target)) {
          this.designer.createLink(source.getId(), target.getId(), {
            designer: this.designer,
            stroke: this.link.stroke,
            sourceConnector: source,
            targetConnector: target,
          });
        }
      }
    }

    this.initialConnector.selected = false;
    this.initialConnector.unfocus();
  }
}

/*
File: src/_movement.link.js
*/

"use strict";

class LinkMovementHandler extends MovementHandler {
  constructor(designer) {
    super(designer);

    this.activeLink = undefined;
    this.currentLink = undefined;
  }

  focus() {
    if (this.activeLink) {
      this.activeLink.selected = true;
      this.activeLink.sourceConnector.selected = true;
      this.activeLink.targetConnector.selected = true;

      this.activeLink.focus();
    }
  }

  unfocus() {
    if (this.activeLink) {
      this.activeLink.selected = false;
      this.activeLink.sourceConnector.selected = false;
      this.activeLink.targetConnector.selected = false;
      this.activeLink.unfocus();
    }

    this.activeLink = undefined;
  }

  start(position) {
    super.start(position);
  }

  update(position) {
    super.update(position);
  }

  stop(position) {
    super.stop(position);

    if (position.dx == 0 && position.dy == 0) {
      // select link
      this.activeLink = this.currentLink;
      this.focus();

      this.designer.callbacks.invokeLinkSelected(this.activeLink);
    }
  }

  reset() {
    this.designer.callbacks.invokeLinkUnselected(this.activeLink);

    this.unfocus();
  }
}

/*
File: src/_input.js
*/

"use strict";

var FlowJS = FlowJS || {};

FlowJS.Input = {

  ActiveDesigner: undefined,

  InputHandlers: {},

  UnfocusDesigner: () => {
    if (FlowJS.Input.ActiveDesigner) {
      FlowJS.Input.ActiveDesigner.container.setAttribute('tabindex', null);
    }
    FlowJS.Input.ActiveDesigner = undefined
  },

  FocusDesigner: (designer) => {
    FlowJS.Input.UnfocusDesigner();
    FlowJS.Input.ActiveDesigner = designer;
    FlowJS.Input.ActiveDesigner.container.setAttribute('tabindex', 0);
  },

  KeyPress: (e) => {
    var designer = FlowJS.Input.ActiveDesigner;

    if (designer == undefined) return;

    for (var i = 0; i < designer.inputHandlers.length; i++) {
      var handler = designer.inputHandlers[i];
      handler.keyPress(e);
    }
  },
}

class InputHandler {
  constructor(designer) {
    this.designer = designer;
    this.designer.inputHandlers.push(this);
  }

  keyPress(e) {
  }
}

/*
File: src/_input.node.js
*/

"use strict";

class NodeInputHandler extends InputHandler {
  constructor(designer) {
    super(designer);
  }

  keyPress(e) {
    super.keyPress(e);

    switch (e.keyCode) {
      case 46:
        // delete selected nodes
        this.designer.deleteSelectedNodes();
        break;
      case 27:
        this.designer.callbacks.invokeNodeUnselected(this.designer.nodeMovementHandler.nodes);
        this.designer.nodeMovementHandler.setSelection();
        break;
    }
  }
}

/*
File: src/_input.link.js
*/

"use strict";

class LinkInputHandler extends InputHandler {
  constructor(designer) {
    super(designer);
  }

  keyPress(e) {
    super.keyPress(e);

    if (this.designer.linkMovementHandler.activeLink == undefined) return;

    switch (e.keyCode) {
      case 46:
        // delete link
        this.designer.deleteLink(this.designer.linkMovementHandler.activeLink);
        break;
      case 27:
        // deselect link
        this.designer.linkMovementHandler.unfocus();
        break;
    }
  }
}

/*
File: src/_designer.js
*/

"use strict";

class Designer {

  constructor(data) {

    this.container = data.container;
    this.designContainer = undefined;

    this.theme = data.theme || FlowJS.Theme.Light;

    this.scale = data.scale || 1;

    this.width = data.width || 5000;
    this.height = data.height || 5000;

    this.nodes = [];
    this.links = [];
    this.connections = {};

    this.activeMovementHandler = undefined;
    this.selectionMovementHandler = new SelectionMovementHandler(this);
    this.designerMovementHandler = new DesignerMovementHandler(this);
    this.nodeMovementHandler = new NodeMovementHandler(this);
    this.connectorMovementHandler = new ConnectorMovementHandler(this);
    this.linkMovementHandler = new LinkMovementHandler(this);

    this.inputHandlers = [];
    this.linkInputHandler = new LinkInputHandler(this);
    this.nodeInputHandler = new NodeInputHandler(this);

    this.callbacks = {
      linkCreated: undefined,
      linkSelected: undefined,
      linkUnselected: undefined,
      linkDeleted: undefined,
      nodeSelected: undefined,
      nodeUnselected: undefined,
      nodeOpened: undefined,
      nodeDeleted: undefined,
      nodeMoved: undefined,
    }

    if (data.callbacks) {
      this.callbacks.linkCreated = data.callbacks.linkCreated || undefined;
      this.callbacks.linkSelected = data.callbacks.linkSelected || undefined;
      this.callbacks.linkUnselected = data.callbacks.linkUnselected || undefined;
      this.callbacks.linkDeleted = data.callbacks.linkDeleted || undefined;
      this.callbacks.nodeSelected = data.callbacks.nodeSelected || undefined;
      this.callbacks.nodeUnselected = data.callbacks.nodeUnselected || undefined;
      this.callbacks.nodeDeleted = data.callbacks.nodeDeleted || undefined;
      this.callbacks.nodeOpened = data.callbacks.nodeOpened || undefined;
      this.callbacks.nodeMoved = data.callbacks.nodeMoved || undefined;
    }

    // register callback event handlers
    this._registerCallbackHandlers();

    this.validation = {
      linkCreate: undefined,
      linkDelete: undefined,
      nodeDelete: undefined,
    }

    if (data.validation) {
      this.validation.linkCreate = data.validation.linkCreate || undefined;
      this.validation.linkDelete = data.validation.linkDelete || undefined;
      this.validation.nodeDelete = data.validation.nodeDelete || undefined;
    }

    // register validation event handlers
    this._registerValidationHandlers();

    this._g = undefined;
    this._svg = undefined;
    this._nodeContainer = undefined;
    this._linkContainer = undefined;
    this._gridContainer = undefined;

    this.updateTheme();

    this.importData(data.import);

    this.initializeContainer();
  }

  updateTheme() {
    //this.gridColor = this.theme.Grid;

    //this.backgroundColor = this.theme.Background;
    //this.selectionBackgroundColor = this.theme.SelectionBackground;
    //this.selectionBorderColor = this.theme.SelectionBorder;

    //this.linkColor = this.theme.Link;
  }

  importData(data) {
    if (data == undefined) return;

    console.log('importing');

    this.nodes = [];
    this.links = [];

    for (var i = 0; i < data.nodes.length; i++) {
      var node = new Node(data.nodes[i]);
      node.designer = this;

      this.nodes.push(node);
    }

    for (var i = 0; i < data.links.length; i++) {
      var linkData = data.links[i];

      var link = new Link(linkData.source, linkData.target, linkData);
      link.designer = this;

      var sourceNode = link.source.substring(0, 8);
      var sourceConnector = link.source.substring(9);

      var targetNode = link.target.substring(0, 8);
      var targetConnector = link.target.substring(9);

      for (var n_id = 0; n_id < this.nodes.length; n_id++) {
        var node = this.nodes[n_id];

        if (node.id == sourceNode) {
          var connector = node.getConnector(sourceConnector);
          if (connector != undefined) {
            link.sourceConnector = connector;
          }
          continue;
        }
        if (node.id == targetNode) {
          var connector = node.getConnector(targetConnector);
          if (connector != undefined) {
            link.targetConnector = connector;
          }
          continue;
        }
      }

      if (link.sourceConnector && link.targetConnector) {
        this.links.push(link);
      }
    }
  }

  initializeContainer() {
    this.container.innerHTML = '';
    this.container.style.overflow = 'hidden';
    this.container.style.position = 'relative';
    this.container.className += FlowJS.Tools.ContainerStyle();

    this.designContainer = document.createElement('div');
    this.container.appendChild(this.designContainer);

    this.designContainer.style.overflow = 'scroll';
    this.designContainer.style.position = 'absolute';
    this.designContainer.style.width = '100%';
    this.designContainer.style.height = '100%';

    this._svg = FlowJS.Tools.GenerateSVG('svg', {
      'font-family': FlowJS.Config.Font.Family,
      'cursor': FlowJS.Config.Grid.Cursor
    });
    this.designContainer.appendChild(this._svg);

    this._svg.designer = this;
    this._svg.isBackground = true;

    this._svg.addEventListener('mousedown', FlowJS.Movement.MouseDown);
    this._svg.addEventListener('mousemove', FlowJS.Movement.MouseMove);
    this._svg.addEventListener('mousewheel', FlowJS.Movement.MouseWheel);
    document.addEventListener('mouseup', FlowJS.Movement.MouseUp);

    this.container.addEventListener('keydown', FlowJS.Input.KeyPress);

    this._defs = FlowJS.Tools.GenerateSVG('defs');
    this._svg.appendChild(this._defs);

    this._g = FlowJS.Tools.GenerateSVG('g');
    this._svg.appendChild(this._g);

    this._gridContainer = FlowJS.Tools.GenerateSVG('rect');
    this._g.appendChild(this._gridContainer);

    this._linkContainer = FlowJS.Tools.GenerateSVG('g');
    this._g.appendChild(this._linkContainer);

    this._nodeContainer = FlowJS.Tools.GenerateSVG('g');
    this._g.appendChild(this._nodeContainer);

    var containerBox = this.container.getBoundingClientRect();

    var watermarkText = document.createElement('div');
    this.container.appendChild(watermarkText);

    watermarkText.style.position = 'absolute';
    watermarkText.style.fontSize = '20px';
    watermarkText.style.fontWeight = 'bold';
    watermarkText.style.zIndex = 100000;
    watermarkText.style.right = '27px';
    watermarkText.style.top = 'calc(100% - 20px - 10px - 17px)';
    watermarkText.style.fontFamily = 'Verdana,Geneva,sans-serif';
    watermarkText.style.pointerEvents = 'none';
    watermarkText.style.color = this.theme.Watermark;
    watermarkText.innerHTML = 'FlowJS';

    this.refresh();
  }

  refresh() {
    this.refreshNodes();
    this.refreshGrid();
  }

  refreshGrid() {
    if (this.scale < FlowJS.Config.Scale.Minimum) this.scale = FlowJS.Config.Scale.Minimum;
    if (this.scale > FlowJS.Config.Scale.Maximum) this.scale = FlowJS.Config.Scale.Maximum;

    this._svg.style.backgroundColor = this.theme.Background;

    var width = this.width * this.scale;
    var height = this.height * this.scale;

    this._svg.setAttribute('width', width + 'px');
    this._svg.setAttribute('height', height + 'px');

    this._g.setAttribute('transform', 'scale(' + this.scale + ')');

    var grid = this._gridContainer;
    this._gridContainer = FlowJS.Tools.GenerateSVG('rect', {
      'fill': 'none',
      'width': this.width,
      'height': this.height,
    });
    grid.parentNode.replaceChild(this._gridContainer, grid);
    this._gridContainer.isBackground = true;
    this._gridContainer.designer = this;

    if (FlowJS.Config.Grid.Enabled) {
      switch (FlowJS.Config.Grid.Style) {
        case FlowJS.GridStyle.Line:
          this._refreshGridLines();
          break;
        case FlowJS.GridStyle.Dot:
          this._refreshGridDots();
          break;
      }
    }

    this._gridContainer.setAttribute('fill', 'url(#GridPattern)');
  }

  _refreshGridLines() {
    if (this._gridPattern) {
      this._defs.removeChild(this._gridPattern);
    }

    this._gridPattern = FlowJS.Tools.GenerateSVG('pattern', {
      'id': 'GridPattern',
      'x': 0,
      'y': 0,
      'width': (FlowJS.Config.Grid.Size / this.width),
      'height': (FlowJS.Config.Grid.Size / this.height),
      'patternUnits': 'objectBoundingBox'
    });
    this._defs.appendChild(this._gridPattern);

    var grid = FlowJS.Tools.GenerateSVG('path', {
      'd': `M${FlowJS.Config.Grid.Size} ${0} L${FlowJS.Config.Grid.Size} ${FlowJS.Config.Grid.Size} ${0} ${FlowJS.Config.Grid.Size}`
    });

    this._gridPattern.appendChild(grid);

    grid.style.fill = 'none';
    grid.style.strokeWidth = FlowJS.Config.Grid.Thickness;
    grid.style.stroke = this.theme.Grid;

    grid.isBackground = true;
    grid.designer = this;
  }

  _refreshGridDots() {
    if (this._gridPattern) {
      this._defs.removeChild(this._gridPattern);
    }

    this._gridPattern = FlowJS.Tools.GenerateSVG('pattern', {
      'id': 'GridPattern',
      'x': 0,
      'y': 0,
      'width': (FlowJS.Config.Grid.Size / this.width),
      'height': (FlowJS.Config.Grid.Size / this.height),
      'patternUnits': 'objectBoundingBox'
    });
    this._defs.appendChild(this._gridPattern);

    var dot = FlowJS.Tools.GenerateSVG('rect', {
      'x': FlowJS.Config.Grid.Size,
      'y': FlowJS.Config.Grid.Size,
      'width': FlowJS.Config.Grid.Thickness,
      'height': FlowJS.Config.Grid.Thickness,
    });

    this._gridPattern.appendChild(dot);

    dot.style.strokeWidth = 4;
    dot.style.stroke = this.theme.Grid;

    dot.isBackground = true;
    dot.designer = this;

    this._gridContainer.setAttribute('fill', 'url(#GridPattern)');
  }

  _populateLineDetails(line) {
    line.style.stroke = this.theme.Grid;
    line.style.strokeWidth = '0.4px';

    line.isBackground = true;
    line.designer = this;

    this._gridContainer.appendChild(line);
  }

  refreshNodes() {
    var nodes = this._nodeContainer;
    this._nodeContainer = FlowJS.Tools.GenerateSVG('g');
    nodes.parentNode.replaceChild(this._nodeContainer, nodes);

    for (var i = 0; i < this.nodes.length; i++) {
      var node = this.nodes[i];
      this.displayNode(node);
    }

    this.refreshLinks();
  }

  refreshLinks() {
    var links = this._linkContainer;
    this._linkContainer = FlowJS.Tools.GenerateSVG('g');
    links.parentNode.replaceChild(this._linkContainer, links);

    for (var i = 0; i < this.links.length; i++) {
      var link = this.links[i];
      link.render();
      link.refresh();
    }
  }

  // refresh all links linked to nodes
  refreshNodeLinks(nodes) {
    var refreshedLinks = {};

    for (var i = 0; i < this.links.length; i++) {
      var link = this.links[i];
      // link already refreshed
      if (refreshedLinks[link.id]) continue;

      var sourceNode = link.sourceConnector.node;
      var targetNode = link.targetConnector.node;

      // if link node is in provided nodes
      if (nodes.indexOf(sourceNode) != -1 || nodes.indexOf(targetNode) != -1) {
        link.refresh();
        refreshedLinks[link.id] = true;
      }
    }
  }

  refreshNodeSelectionStates() {
    for (var i = 0; i < this.nodes.length; i++) {
      var node = this.nodes[i];
      node.refreshBackground();
    }
  }

  export() {
    var designer = {
      nodes: FlowJS.Tools.ExportCollection(this.nodes),
      links: FlowJS.Tools.ExportCollection(this.links)
    };

    return designer;
  }

  createNode(data) {
    // Calculate X and Y position
    data.x = data.x + (this.designContainer.scrollLeft / this.scale);
    data.y = data.y + (this.designContainer.scrollTop / this.scale);
    data.designer = this;

    var node = new Node(data);
    this.nodes.push(node);

    this.displayNode(node);

    return node;
  }

  displayNode(node) {
    node.designer = this;

    var nodeElement = node.render();
    this._nodeContainer.appendChild(nodeElement);
  }

  deleteSelectedNodes() {
    this.linkMovementHandler.unfocus();

    var deleteNodes = [];
    for (var i = 0; i < this.nodes.length; i++) {
      var node = this.nodes[i];
      if (node.selected) {
        deleteNodes.push(node);
      }
    }

    if (this.validation.invokeNodeDelete(deleteNodes) == false) {
      return;
    }

    for (var i = 0; i < deleteNodes.length; i++) {
      var node = deleteNodes[i];
      var index = this.nodes.indexOf(node);

      this.nodes.splice(index, 1);
      node.destroy();
    }

    this.callbacks.invokeNodeDeleted(deleteNodes);

    var deleteLinks = [];

    for (var i = 0; i < this.links.length; i++) {
      var link = this.links[i];

      var sourceNode = link.sourceConnector.node;
      var targetNode = link.targetConnector.node;

      if (deleteNodes.indexOf(sourceNode) != -1 || deleteNodes.indexOf(targetNode) != -1) {
        deleteLinks.push(link);
      }
    }

    for (var i = 0; i < deleteLinks.length; i++) {
      var link = deleteLinks[i];
      var index = this.links.indexOf(link);

      this.links.splice(index, 1);
      link.destroy();
    }
  }

  createLink(source, target, data) {
    for (var i = 0; i < this.links.length; i++) {
      var link = this.links[i];
      if (link.source == source && link.target == target) {
        return;
      }
    }

    data.designer = this;

    var link = new Link(source, target, data);
    this.links.push(link);

    link.render();
    link.refresh();

    this.callbacks.invokeLinkCreated(link);
  }

  deleteLink(link) {
    var index = this.links.indexOf(link);
    if (index == -1) return;

    if (this.validation.invokeLinkDelete(link)) {
      this.linkMovementHandler.unfocus();
      link.destroy();

      this.links.splice(index, 1);

      this.callbacks.invokeLinkDeleted(link);
    }
  }

  _registerCallbackHandlers() {
    this.callbacks.invokeLinkCreated = (link) => {
      if (!this.callbacks.linkCreated) return;
      if (!link) return;

      this.callbacks.linkCreated(link);
    };

    this.callbacks.invokeLinkDeleted = (link) => {
      if (!this.callbacks.linkDeleted) return;
      if (!link) return;

      this.callbacks.linkDeleted(link);
    };

    this.callbacks.invokeLinkSelected = (link) => {
      if (!this.callbacks.linkSelected) return;
      if (!link) return;

      this.callbacks.linkSelected(link);
    };

    this.callbacks.invokeLinkUnselected = (link) => {
      if (!this.callbacks.linkUnselected) return;
      if (!link) return;

      this.callbacks.linkUnselected(link);
    };

    this.callbacks.invokeNodeSelected = (nodes) => {
      if (!this.callbacks.nodeSelected) return;
      if (!nodes || nodes.length == 0) return;

      this.callbacks.nodeSelected(nodes);
    };

    this.callbacks.invokeNodeUnselected = (nodes) => {
      if (!this.callbacks.nodeUnselected) return;
      if (!nodes || nodes.length == 0) return;

      this.callbacks.nodeUnselected(nodes);
    };

    this.callbacks.invokeNodeOpened = (node) => {
      if (!this.callbacks.nodeOpened) return;
      if (!node) return;

      this.callbacks.nodeOpened(node);
    };

    this.callbacks.invokeNodeDeleted = (nodes) => {
      if (!this.callbacks.nodeDeleted) return;
      if (!nodes || nodes.length == 0) return;

      this.callbacks.nodeDeleted(nodes);
    };

    this.callbacks.invokeNodeMoved = (nodes) => {
      if (!this.callbacks.nodeMoved) return;
      if (!nodes || nodes.length == 0) return;

      this.callbacks.nodeMoved(nodes);
    };
  }

  _registerValidationHandlers() {
    this.validation.invokeLinkCreate = (source, target) => {
      if (!this.validation.linkCreate) return true;
      if (!link) return true;

      return this.validation.linkCreate(source, target);
    };

    this.validation.invokeLinkDelete = (link) => {
      if (!this.validation.linkDelete) return true;
      if (!link) return true;

      return this.validation.linkDelete(link);
    };

    this.validation.invokeNodeDelete = (nodes) => {
      if (!this.validation.nodeDelete) return true;
      if (!link) return true;

      return this.validation.nodeDelete(nodes);
    };


  }
}


/*
File: src/_node.js
*/

"use strict";

class Node {

  constructor(data) {

    this.x = data.x || 0;
    this.y = data.y || 0;


    this.width = data.width || 225;
    this.height = data.height || 45;

    this.id = data.id || FlowJS.Tools.GenerateId(8);

    this.type = data.type || 'unknown';

    this.name = data.name;
    this.description = data.description;

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
    this.refreshPosition(true);
    this.refreshSize();
  }

  refreshText() {
    this.nameText.innerHTML = this.name;
    this.descriptionText.innerHTML = this.description;
  }

  refreshImage() {
    // image not supported
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

  }

  export() {
    var node = {
      id: this.id,

      x: this.x,
      y: this.y,

      type: this.type,
      name: this.name,
      description: this.description,
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
      'transform': `translate(${this.x}, ${this.y})`,
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
      'ry': 5
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
      'height': this.height,
    });
    clippingArea.appendChild(clippingRectangle);

    // text container
    var textArea = FlowJS.Tools.GenerateSVG('g', {
      'clip-path': `url(#${clippingId})`
    });
    this.element.appendChild(textArea);

    // name
    this.nameText = FlowJS.Tools.GenerateSVG('text', {
      'x': horizontalMargin,
      'y': 20,
      'font-size': FlowJS.Config.Font.Size,
      'font-weight': 'bold'
    });
    textArea.appendChild(this.nameText);

    // description
    this.descriptionText = FlowJS.Tools.GenerateSVG('text', {
      'x': horizontalMargin,
      'y': 20 + FlowJS.Config.Font.Size,
      'font-size': FlowJS.Config.Font.Size,
    });
    textArea.appendChild(this.descriptionText);
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

/*
File: src/_connector.js
*/

"use strict";

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
        'font-size': 10,
        'opacity': 0.2
      });
      this.element.appendChild(this.nameText);
      this.nameText.innerHTML = this.name;
      
      var x = 0;
      var y = 8;

      switch (this.type) {
        case FlowJS.ConnectorType.Input:
          x = 12;
          y = 8;
          break;
        case FlowJS.ConnectorType.Output:
          x = (FlowJS.Tools.MeasureText(this.name, 'normal 10px ' + FlowJS.Config.Font.Family) * -1) - 2;
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
  }

  unfocus() {
    if (this.selected) return;

    this.connector.style.stroke = this.node.borderColor;
    this.nameText.setAttribute('opacity', 0.2);    
  }
}

/*
File: src/_link.js
*/

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

    this.stroke = data.stroke;

    this.selected = false;

    this.sourceConnector = data.sourceConnector;
    this.targetConnector = data.targetConnector;

    this.designer = data.designer;
  }

  export() {
    var link = {
      source: this.source,
      target: this.target,
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
    if (this.targetConnector == undefined) return;

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
    this.overlay.setAttribute('d', data);
  }

  render() {
    this._renderShadow();
    this._renderElement();
    this._renderOverlay();
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

      if (designer.activeMovementHandler != undefined) {
        if (designer.activeMovementHandler.active) {
          return;
        }
      }

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

    this.designer._linkContainer.removeChild(this.overlay);
  }
}

