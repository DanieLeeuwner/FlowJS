"use strict";

var FlowJS = FlowJS || {};

FlowJS.Input = {

  ActiveDesigner: undefined,

  InputHandlers: {},

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
    var designer = FlowJS.Input.ActiveDesigner;

    if (designer == undefined) return;

    for (var i = 0; i < designer.inputHandlers.length; i++) {
      var handler = designer.inputHandlers[i];
      handler.keyPress(e);
    }
  },
}

class InputHandler {
  constructor(designer) {
    this.designer = designer;
    this.designer.inputHandlers.push(this);
  }

  keyPress(e) {
  }
}