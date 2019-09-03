class NodeInputHandler extends InputHandler {
  constructor(designer) {
    super(designer);
  }

  exportSelectedNodes() {
    // export selected nodes and links to clipboard
    var exportedNodes = this.designer.exportSelectedNodes();
    if (exportedNodes.nodes.length > 0) {
      var exportJson = JSON.stringify(exportedNodes);
      FlowJS.Tools.CopyToClipboard(exportJson);
    }
  }

  keyPress(e) {
    super.keyPress(e);

    switch (e.key) {
      case 'Delete':
        this.designer.deleteSelectedNodes();
        break;

      case 'Escape':
        this.designer.callbacks.invokeNodeUnselected(this.designer.nodeMovementHandler.nodes);
        this.designer.nodeMovementHandler.setSelection();
        break;

      case 'c':
        if (e.ctrlKey) {
          this.exportSelectedNodes();
        }
        break;

      case 'x':
        if (e.ctrlKey) {
          this.exportSelectedNodes();
        }
        this.designer.deleteSelectedNodes();
        break;

      case 'v':
        if (e.ctrlKey) {
          FlowJS.Tools.PasteFromClipboard().then((data) => {
            var importedNodes = JSON.parse(data);
            this.designer.importPartial(importedNodes);
          });
        }
        break;

      case 'z':
        if (e.ctrlKey) {
          this.designer.performUndo();
        }
        break;

      case 'y':
        if (e.ctrlKey) {
          this.designer.performRedo();
        }
        break;
    }
  }
}