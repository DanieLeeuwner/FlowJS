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

    this.import(data.import);

    this.initializeContainer();
  }

  updateTheme() {
    //this.gridColor = this.theme.Grid;

    //this.backgroundColor = this.theme.Background;
    //this.selectionBackgroundColor = this.theme.SelectionBackground;
    //this.selectionBorderColor = this.theme.SelectionBorder;

    //this.linkColor = this.theme.Link;
  }

  import(data) {
    if (!data) return;

    data.nodes = data.nodes || [];
    data.links = data.links || [];

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
      return this.validation.linkCreate(source, target);
    };

    this.validation.invokeLinkDelete = (link) => {
      if (!this.validation.linkDelete) return true;
      return this.validation.linkDelete(link);
    };

    this.validation.invokeNodeDelete = (nodes) => {
      if (!this.validation.nodeDelete) return true;
      return this.validation.nodeDelete(nodes);
    };
  }
}
