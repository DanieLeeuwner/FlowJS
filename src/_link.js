"use strict";

class Link {

  constructor(source, target, data) {
    data = data || {};

    this.id = data.id || FlowJS.Tools.GenerateId(8);

    // (node.id).(connector.id)
    this.source = source;
    this.target = target;

    this.x = 0;
    this.y = 0;

    this.hint = data.hint;
    this.stroke = data.stroke;

    this.sourceConnector = data.sourceConnector;
    this.targetConnector = data.targetConnector;

    this.designer = data.designer;
  }

  export() {
    var link = {
      source: this.source,
      target: this.target,
      hint: this.hint,
      stroke: this.stroke,
    }

    return link;
  }

  refresh() {

  }

  render() {
    var data

    this._renderShadow(data);
    this._renderPath(data);
    this._renderOverlay(data);
  }

  _renderShadow(data) {

  }

  _renderPath(data) {

  }

  _renderOverlay(data) {

  }
}