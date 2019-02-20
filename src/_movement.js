"use strict";

var FlowJS = FlowJS || {};

FlowJS.Movement = {
  MouseDown: (e) => {
    var position = FlowJS.Tools.GetPosition(e);
    if (position == undefined) {
      FlowJS.Input.UnfocusDesigner();
      return;
    }
    var designer = position.designer;
    FlowJS.Input.FocusDesigner(designer);

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
    if (designer.activeMovementHandler.active == false) return;
    designer.activeMovementHandler.update(position);
  },

  MouseUp: (e) => {
    var position = FlowJS.Tools.GetPosition(e) || {};
    //if (position == null) return;

    var designer = FlowJS.Input.ActiveDesigner;
    if (designer == undefined) return;
    
    position.designer = designer;

    if (designer.activeMovementHandler == undefined) return;
    if (designer.activeMovementHandler.active == false) return;
    designer.activeMovementHandler.stop(position);
  },
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