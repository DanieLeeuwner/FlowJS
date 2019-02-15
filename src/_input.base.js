"use strict";

var FlowJS = FlowJS || {};

FlowJS.Input = {

  ActiveDesigner: undefined,

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
    if (FlowJS.Input.ActiveDesigner == undefined) return;

    var designer = FlowJS.Input.ActiveDesigner;

    if (designer.activeInputHandler) {
      designer.activeInputHandler.keyPress(e);
    }

  },

}

class InputHanlder {
  constructor(designer) {
    this.designer = designer;
  }

  start() {
    this.designer.activeInputHandler = this;
  }

  keyPress(e) {
  }

  stop() {
    if (this.designer.activeInputHandler == this) {
      this.designer.activeInputHandler = undefined;
    }
  }
}