"use strict";

var FlowJS = FlowJS || {};

FlowJS.Movement = {
  MouseDown: (e) => {
    var position = FlowJS.Tools.GetPosition(e);
    if (position == undefined) return;
    var designer = position.designer;

    designer.initialX = position.x;
    designer.initialY = position.y;

    if (e.target.isBackground) {
      designer.selectionMovementHandler.start(position);
    }
  },

  MouseMove: (e) => {
    var position = FlowJS.Tools.GetPosition(e);
    if (position == undefined) return;
    var designer = position.designer;

    if (designer.activeMovementHandler == undefined) return;
    designer.activeMovementHandler.update(position);
  },

  MouseUp: (e) => {
    var position = FlowJS.Tools.GetPosition(e);
    if (position == null) return;
    var designer = position.designer;

    if (designer.activeMovementHandler == undefined) return;
    designer.activeMovementHandler.stop(position);
  },
}

class MovementHandler {
  constructor(designer) {
    this.designer = designer;

    this.initialX = 0;
    this.initialY = 0;
  }

  start(position) {
    this.designer.activeMovementHandler = this;

    this.initialX = position.x;
    this.initialY = position.y;
  }

  update(position) {

  }

  stop(position) {
    this.designer.activeMovementHandler = undefined;
  }
}