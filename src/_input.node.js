"use strict";

class NodeInputHandler extends InputHanlder {
  constructor(designer) {
    super(designer);
  }

  start() {
    super.start();
  }

  keyPress(e) {
    super.keyPress(e);

    switch (e.keyCode) {
      case 46:
        // delete selected nodes
        this.designer.deleteSelectedNodes();
        break;
      case 27:
        this.designer.nodeMovementHandler.setSelection();
        break;
    }
  }

  stop() {
    super.stop();
  }
}