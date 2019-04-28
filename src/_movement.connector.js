"use strict";

class ConnectorMovementHandler extends MovementHandler {
  constructor(designer) {
    super(designer);

    this.initialConnector = undefined;
    this.finalConnector = undefined;

    this.link = undefined;
  }

  start(position) {
    super.start(position);

    this.designer.nodeMovementHandler.setSelection();
    this.designer.linkMovementHandler.unfocus();

    this.link = new Link(undefined, undefined, {
      designer: this.designer,
      sourceConnector: this.initialConnector,
      stroke: FlowJS.Tools.SelectRandom(this.designer.theme.Link),
      enableEvents: false,
      x: position.x,
      y: position.y
    });

    this.link.render();
    this.link.refresh();
  }

  update(position) {
    super.update(position);

    this.link.x = position.x;
    this.link.y = position.y;

    this.link.refresh();
  }

  stop(position) {
    super.stop(position);

    this.link.destroy();

    if (this.finalConnector) {
      var source = this.initialConnector.type == FlowJS.ConnectorType.Output ? this.initialConnector : this.finalConnector;
      var target = this.initialConnector.type == FlowJS.ConnectorType.Input ? this.initialConnector : this.finalConnector;

      if (source.node != target.node && source.type != target.type) {
        if (this.designer.validation.invokeLinkCreate(source, target)) {
          this.designer.createLink(source.getId(), target.getId(), {
            designer: this.designer,
            stroke: this.link.stroke,
            sourceConnector: source,
            targetConnector: target,
          });
        }
      }
    }

    this.initialConnector.selected = false;
    this.initialConnector.unfocus();
  }
}