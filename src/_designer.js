"use strict";

class Designer {

  constructor(data) {

    this.container = data.container;
    this.designContainer = undefined;
    
    this.theme = data.theme || FlowJS.Theme.Light;

    this.scale = data.zoom || 0.8;

    this.width = data.width || 2500;
    this.height = data.height || 2500;

    this.nodes = [];
    this.links = [];
    this.connections = {};

    this.activeMovementHandler = undefined;

    this.selectionMovementHandler = new SelectionMovementHandler(this);
    this.nodeMovementHandler = new NodeMovementHandler(this);
    this.connectorMovementHandler = new ConnectorMovementHandler(this);

    this.callbacks = {
      linkCreated: undefined,
      linkDeleted: undefined,
      nodeSelected: undefined,
      nodeUnselected: undefined,
      nodeOpened: undefined,
      nodeDeleted: undefined,
      nodeMoved: undefined,
    }

    if (data.callbacks) {
      this.callbacks.linkCreated = data.callbacks.linkCreated || undefined;
      this.callbacks.linkDeleted = data.callbacks.linkDeleted || undefined;
      this.callbacks.nodeSelected = data.callbacks.nodeSelected || undefined;
      this.callbacks.nodeUnselected = data.callbacks.nodeUnselected || undefined;
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

    this.nodes = data.nodes || [];
    this.links = data.links || [];
  }

  initializeContainer() {
    this.container.innerHTML = '';
    this.container.style.overflow = 'hidden';
    this.container.style.position = 'relative';
    this.container.className += FlowJS.Tools.NoSelect();

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
    document.addEventListener('mouseup', FlowJS.Movement.MouseUp);

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

    this.refreshGrid();
    this.refresh();
  }

  refresh() {
    this.refreshNodes();
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
    grid.style.strokeWidth = 2;
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
      'width': 1,
      'height': 1,
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
      this.displayLink(link);
    }
  }

  // refresh link data points
  refreshLinkData(link) {
    var source = link.sourceConnector;
    var target = link.targetConnector;

    var type = source.type;
    var sourcePosition = source.getPosition();
    var targetPosition = target.getPosition();

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
      link.shadowElement.setAttribute('d', data);
    }

    link.element.setAttribute('d', data);
    link.overlay.setAttribute('d', data);
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
        this.refreshLinkData(link);
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
    this.displayLink(link);
  }

  displayLink(link) {
    var stroke = link.stroke || FlowJS.Tools.SelectRandom(this.theme.Link);
    var thickness = FlowJS.Config.Link.Thickness;
    var shadowThickness = FlowJS.Config.Link.Shadow.Thickness;
    var shadowOpacity = FlowJS.Config.Link.Shadow.Opacity;

    if (FlowJS.Config.Link.Shadow.Enabled) {
      link.shadowElement = FlowJS.Tools.GenerateSVG('path');
      this._linkContainer.appendChild(link.shadowElement);

      link.shadowElement.style.stroke = FlowJS.Config.Link.Shadow.Color || stroke;
      link.shadowElement.style.fill = 'none';
      link.shadowElement.style.strokeOpacity = shadowOpacity;
      link.shadowElement.style.strokeWidth = shadowThickness; 
    }

    link.element = FlowJS.Tools.GenerateSVG('path');
    this._linkContainer.appendChild(link.element);

    link.element.style.stroke = stroke;
    link.element.style.fill = 'none';
    link.element.style.strokeWidth = thickness;

    link.overlay = FlowJS.Tools.GenerateSVG('path');
    this._linkContainer.appendChild(link.overlay);

    link.overlay.style.stroke = 'rgba(0,0,0,0)';
    link.overlay.style.fill = 'none';
    link.overlay.style.strokeWidth = Math.max(thickness + 2, shadowThickness);

    link.overlay.link = link;

    link.overlay.addEventListener('mouseover', (e) => {
      var link = e.target.link;
      var designer = link.designer;

      if (designer.activeMovementHandler != undefined) return;

      link.element.style.stroke = 'orange';


      if (FlowJS.Config.Link.Shadow.Enabled) {
        FlowJS.Tools.BringToFront(designer._linkContainer, link.shadowElement);
      }
      FlowJS.Tools.BringToFront(designer._linkContainer, link.element);
      FlowJS.Tools.BringToFront(designer._linkContainer, link.overlay);

      link.sourceConnector.focus();
      link.targetConnector.focus();
    });

    link.overlay.addEventListener('mouseout', (e) => {
      var link = e.target.link;
      link.element.style.stroke = link.stroke;

      link.sourceConnector.unfocus();
      link.targetConnector.unfocus();
    });

    this.refreshLinkData(link);
  }

  registerConnection(connection) {
    this.connections[connection.getId()] = connection;
  }
}