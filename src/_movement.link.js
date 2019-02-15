"use strict";

class LinkMovementHandler extends MovementHandler {
  constructor(designer) {
    super(designer);

    this.activeLink = undefined;
    this.currentLink = undefined;
  }

  focus() {
    if (this.activeLink) {
      this.activeLink.selected = true;
      this.activeLink.sourceConnector.selected = true;
      this.activeLink.targetConnector.selected = true;

      this.activeLink.focus();

      this.designer.linkInputHandler.start();
    }
  }

  unfocus() {
    if (this.activeLink) {
      this.activeLink.selected = false;
      this.activeLink.sourceConnector.selected = false;
      this.activeLink.targetConnector.selected = false;
      this.activeLink.unfocus();
    }
    this.activeLink = undefined;

    this.designer.linkInputHandler.stop();
  }

  start(position) {
    super.start(position);

    this.designer.nodeMovementHandler.setSelection();
  }

  update(position) {
    super.update(position);
  }

  stop(position) {
    super.stop(position);

    if (position.dx == 0 && position.dy == 0) {
      // select link
      this.activeLink = this.currentLink;
      this.focus();
    }
  }
}