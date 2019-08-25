"use strict";

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
      //sessionStorage.setItem('flowjs-clipboard', exportJson);
    }
  }

  keyPress(e) {
    super.keyPress(e);

    console.log(e.key);

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
          //var importJson = sessionStorage.getItem('flowjs-clipboard');
          FlowJS.Tools.PasteFromClipboard().then((data) => {
            var importedNodes = JSON.parse(data);
            this.designer.importPartial(importedNodes);
          });
        }
        break;
    }
  }
}