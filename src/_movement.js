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