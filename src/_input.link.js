class LinkInputHandler extends InputHandler {
  constructor(designer) {
    super(designer);
  }

  keyPress(e) {
    super.keyPress(e);

    if (this.designer.linkMovementHandler.activeLink == undefined) return;

    switch (e.key) {
      case 'Delete':
        // delete link
        this.designer.deleteLink(this.designer.linkMovementHandler.activeLink);
        break;

      case 'Escape':
        // deselect link
        this.designer.linkMovementHandler.unfocus();
        break;
    }
  }
}