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
  }

  start(position) {
    super.start(position);
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

  reset() {
    this.designer.linkMovementHandler.unfocus();
  }
}