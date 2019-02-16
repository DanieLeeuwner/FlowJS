"use strict";

class LinkInputHandler extends InputHandler {
  constructor(designer) {
    super(designer);
  }

  keyPress(e) {
    super.keyPress(e);

    if (this.designer.linkMovementHandler.activeLink == undefined) return;

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
}