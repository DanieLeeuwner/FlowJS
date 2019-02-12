"use strict";

class Link {

  constructor(source, target, data) {
    this.source = source;
    this.target = target;

    this.x = 0;
    this.y = 0;

    this.thickness = 5;

    this.hint = undefined;

    if (data) {
      this.hint = data.hint;
    }

    this.element = undefined;

    this.sourceConnector = undefined;
    this.targetConnector = undefined;
    
    this.sourceNode = undefined;
    this.targetNode = undefined;

    this.designer = undefined;
  }

  export() {
    var link = {
      source: this.source,
      target: this.target,
      hint: this.hint,
    }

    return link;
  }
}