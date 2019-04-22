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