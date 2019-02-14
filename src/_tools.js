var FlowJS = FlowJS || {};

FlowJS

FlowJS.Tools = {
  GenerateId: (length) => {    
    var pattern = new Array(length + 1).join('x');
    return pattern.replace(/[x]/g, (c) => {
      var r = Math.random() * 16 | 0;
      return r.toString(16);
    });
  },

  ExportCollection: (data) => {
    var output = [];

    for (var id = 0; id < data.length; id++) {
      output.push(data[i].export);
    }

    return output;
  },

  GenerateSVG: (type, attributes) => {
    var element = document.createElementNS('http://www.w3.org/2000/svg', type);
    for (var i in attributes) {
      element.setAttribute(i, attributes[i]);
    }
    return element;
  },

  _noSelect: undefined,

  NoSelect: () => {
    if (FlowJS.Tools._noSelect) {
      return FlowJS.Tools._noSelect;
    }

    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = 
     `.FlowJS_NoSelect {
        -webkit-touch-callout: none;
          -webkit-user-select: none;
           -khtml-user-select: none;
             -moz-user-select: none;
              -ms-user-select: none;
                  user-select: none;
      }`;
    document.getElementsByTagName('head')[0].appendChild(style);

    FlowJS.Tools._noSelect = 'FlowJS_NoSelect';

    return FlowJS.Tools._noSelect;
  },

  GetPosition: (e) => {
    var i = 0;
    while (i < e.path.length && e.path[i].designer == undefined) {
      i++;
    }

    if (i == e.path.length) return undefined;
    var designer = e.path[i].designer;

    var x = e.offsetX;
    var y = e.offsetY;

    x /= designer.scale;
    y /= designer.scale;

    var dx = designer.initialX - x;
    var dy = designer.initialY - y;

    return {
      x: x,
      y: y,
      dx: dx,
      dy: dy,
      designer: designer
    }
  },

  SelectRandom: (items) => {
    return items[Math.floor(Math.random() * items.length)];
  },

  BringToFront: (container, element) => {
    container.removeChild(element);
    container.appendChild(element);
  }
}