"use strict";

class NodeInputHandler extends InputHandler {
  constructor(designer) {
    super(designer);
  }

  keyPress(e) {
    super.keyPress(e);

    switch (e.keyCode) {
      case 46:
        // delete selected nodes
        this.designer.deleteSelectedNodes();
        break;
      case 27:
        this.designer.callbacks.invokeNodeUnselected(this.designer.nodeMovementHandler.nodes);
        this.designer.nodeMovementHandler.setSelection();
        break;
    }
  }
}