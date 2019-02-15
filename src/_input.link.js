"use strict";

class LinkInputHandler extends InputHanlder {
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
        // delete link
        this.designer.deleteLink(this.designer.linkMovementHandler.activeLink);
        break;
      case 27:
        // deselect link
        this.designer.linkMovementHandler.unfocus();
        break;
    }
  }

  stop() {
    super.stop();
  }
}