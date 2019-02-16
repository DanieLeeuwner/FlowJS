"use strict";

class SelectionMovementHandler extends MovementHandler {
  constructor(designer) {
    super(designer);

    this.element = undefined;
  }

  start(position) {
    super.start(position);

    this.element = FlowJS.Tools.GenerateSVG('rect');
    this.designer._svg.appendChild(this.element);

    this.element.style.fill = this.designer.theme.SelectionBackground;
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
    }

    this.designer._svg.removeChild(this.element);
    this.element = undefined;

    this.designer.activeMovementHandler = this.designer.nodeMovementHandler;

    if (this.designer.nodeMovementHandler.nodes.length > 0 && this.designer.callbacks.nodeSelected) {
      this.designer.callbacks.nodeSelected(this.designer.nodeMovementHandler.nodes);
    }
  }
}