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
