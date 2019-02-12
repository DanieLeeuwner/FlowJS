"use strict";

class Designer {

  constructor(data) {

    this.container = data.container;
    
    this.theme = data.theme || FlowJS.Theme.Light;

    this.scale = data.zoom || 0.8;

    this.width = data.width || 2500;
    this.height = data.height || 2500;

    this.nodes = [];
    this.links = [];

    this.mouseMode = FlowJS.MouseMode.None;
    this.mouseInitialX = 0;
    this.mouseInitialY = 0;

    this.activeNode = undefined;
    this.activeSelectionNodes = [];
    this.activeConnector = undefined;
    this.activeLink = undefined;

    this.callbacks = {
      linkCreated: undefined,
      linkDeleted: undefined,
      nodeSelected: undefined,
      nodeOpened: undefined,
      nodeDeleted: undefined,
      nodeMoved: undefined,
    }

    if (data.callbacks) {
      this.callbacks.linkCreated = data.callbacks.linkCreated || undefined;
      this.callbacks.linkDeleted = data.callbacks.linkDeleted || undefined;
      this.callbacks.nodeSelected = data.callbacks.nodeSelected || undefined;
      this.callbacks.nodeOpened = data.callbacks.nodeOpened || undefined;
      this.callbacks.nodeDeleted = data.callbacks.nodeDeleted || undefined;
      this.callbacks.nodeMoved = data.callbacks.nodeMoved || undefined;
    }

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

    this._g = undefined;
    this._svg = undefined;
    this._nodeContainer = undefined;
    this._gridContainer = undefined;
    this._selectionRectangle = undefined;

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

    this.nodes = data.nodes || [];
    this.links = data.links || [];
  }

  initializeContainer() {
    this.container.innerHTML = '';
    this.container.style.overflow = 'scroll';

    this.container.className += FlowJS.Tools.NoSelect();

    this._svg = FlowJS.Tools.GenerateSVG('svg', {
      'font-family': FlowJS.Config.FontFamily,
      'cursor': FlowJS.Config.GridCursor
    });
    this.container.appendChild(this._svg);

    this._svg.designer = this;
    this._svg.isBackground = true;

    this._svg.addEventListener('mousedown', this.mouseDown);
    this._svg.addEventListener('mousemove', this.mouseMove);
    this._svg.addEventListener('mouseup', this.mouseUp);

    this._g = FlowJS.Tools.GenerateSVG('g');
    this._svg.appendChild(this._g);

    this._gridContainer = FlowJS.Tools.GenerateSVG('g');
    this._g.appendChild(this._gridContainer);

    this._nodeContainer = FlowJS.Tools.GenerateSVG('g');
    this._g.appendChild(this._nodeContainer);

    this.refreshGrid();
    this.refresh();
  }

  mouseDown(e) {
    var position = FlowJS.Tools.GetPosition(e);
    var designer = position.designer;

    designer.mouseInitialX = position.x;
    designer.mouseInitialY = position.y;

    if (e.target.isBackground) {
      designer.mouseMode = FlowJS.MouseMode.Selection;

      designer._selectionRectangle = FlowJS.Tools.GenerateSVG('rect', {

      });

      designer._selectionRectangle.fill = designer.theme.SelectionBackground;
      designer._selectionRectangle.stroke = designer.theme.SelectionBorder;
      designer._selectionRectangle.strokeWidth = '1px';
    }    
  }

  mouseMove(e) {
    var position = FlowJS.Tools.GetPosition(e);
    var designer = position.designer;

    switch (designer.mouseMode) {
      case FlowJS.MouseMode.Selection:
        designer.mouseMoveSelectionRectangle(position);
        break;

      case FlowJS.MouseMode.Node:
        designer.mouseMoveNode(position);
        break;

      case FlowJS.MouseMode.Link:
        designer.mouseMoveLink(position);
        break;
    }
  }

  mouseMoveSelectionRectangle(position) {

  }

  mouseMoveNode(position) {
    this.activeNode.x = this.activeNode.initialX - position.dx;
    this.activeNode.y = this.activeNode.initialY - position.dy;
    this.activeNode.refresh();
  }

  mouseMoveLink(position) {

  }

  mouseUp(e) {
    var position = FlowJS.Tools.GetPosition(e);
    var designer = position.designer;

    /*
    if (position.dy == 0 && position.dx == 0) {
      // deselect / cancel
      for (var i = 0; i < designer.activeNodes.length; i++) {
        var node = designer.activeNodes[i];
        node.selected = false;
        node.refresh();
      }
      return;
    }
    */

    switch (designer.mouseMode) {
      case FlowJS.MouseMode.Selection:
        designer.mouseUpSelectionRectangle(position);
        break;

      case FlowJS.MouseMode.Node:
        designer.mouseUpNode(position);
        break;

      case FlowJS.MouseMode.Link:
        designer.mouseUpLink(position);
        break;
    }
  }

  mouseUpSelectionRectangle(position) {

  }

  mouseUpNode(position) {
    var node = designer.activeNode;
    designer.activeNode = undefined;

    if (FlowJS.Config.GridSnap) {
      node.x = Math.round(node.x / FlowJS.Config.GridSize) * FlowJS.Config.GridSize;
      node.y = Math.round(node.y / FlowJS.Config.GridSize) * FlowJS.Config.GridSize;
    }

    node.selected = false;
    node.refresh();

    designer.mouseMode = FlowJS.MouseMode.None;
  }

  mouseUpLink(position) {

  }

  refresh() {
    this.refreshNodes();
  }

  refreshGrid() {
    if (this.scale < FlowJS.Config.ScaleMinimum) this.scale = FlowJS.Config.ScaleMinimum;
    if (this.scale > FlowJS.Config.ScaleMaximum) this.scale = FlowJS.Config.ScaleMaximum;

    this._svg.style.backgroundColor = this.theme.Background;

    var width = this.width * this.scale;
    var height = this.height * this.scale;

    this._svg.setAttribute('width', width + 'px');
    this._svg.setAttribute('height', height + 'px');

    this._g.setAttribute('transform', 'scale(' + this.scale + ')');

    var grid = this._gridContainer;
    this._gridContainer = FlowJS.Tools.GenerateSVG('g');
    grid.parentNode.replaceChild(this._gridContainer, grid);

    if (FlowJS.Config.GridEnabled) {
      var horizontalCount = this.width / FlowJS.Config.GridSize;

      for (var i = 1; i < horizontalCount; i++) {
        var line = FlowJS.Tools.GenerateSVG('line', {
          "x1": i * FlowJS.Config.GridSize,
          "x2": i * FlowJS.Config.GridSize,
          "y1": 0,
          "y2": this.height,
        });

        this._populateLineDetails(line);
      }

      var verticalCount = this.height / FlowJS.Config.GridSize;

      for (var i = 1; i < verticalCount; i++) {
        var line = FlowJS.Tools.GenerateSVG('line', {
          "x1": 0,
          "x2": this.width,
          "y1": i * FlowJS.Config.GridSize,
          "y2": i * FlowJS.Config.GridSize,
        });

        this._populateLineDetails(line);
      }
    }
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

  }

  refreshNodeStates() {

  }

  refreshLinkStates() {

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
    data.x = data.x + (this.container.scrollLeft / this.scale);
    data.y = data.y + (this.container.scrollTop / this.scale);

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

  addSelectedNode(node) {
    var index = this.activeSelectionNodes.indexOf(node);
    if (index == -1) {
      this.activeSelectionNodes.push(node);
    }

    node.selected = true;
    node.refresh();
  }

  removeSelectedNode(node) {
    var index = this.activeSelectionNodes.indexOf(node);
    if (index != -1) {
      this.activeSelectionNodes.splice(index, 1);
    }

    node.selected = false;
    node.refresh();
  }
}