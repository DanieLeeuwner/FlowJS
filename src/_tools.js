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
     `.noselect {
        -webkit-touch-callout: none; /* iOS Safari */
          -webkit-user-select: none; /* Safari */
           -khtml-user-select: none; /* Konqueror HTML */
             -moz-user-select: none; /* Firefox */
              -ms-user-select: none; /* Internet Explorer/Edge */
                  user-select: none; /* Non-prefixed version, currently
                                        supported by Chrome and Opera *
      }`;
    document.getElementsByTagName('head')[0].appendChild(style);

    FlowJS.Tools._noSelect = 'noselect';

    return FlowJS.Tools._noSelect;
  },

  GetPosition: (e) => {
    var i = 0;
    while (i < e.path.length && e.path[i].designer == undefined) {
      i++;
    }

    if (i == e.path.length) return;
    var designer = e.path[i].designer;

    var x = e.x + designer.container.scrollLeft;
    var y = e.y + designer.container.scrollTop;

    x /= designer.scale;
    y /= designer.scale;

    var dx = designer.mouseInitialX - x;
    var dy = designer.mouseInitialY - y;

    return {
      x: x,
      y: y,
      dx: dx,
      dy: dy,
      designer: designer
    }
  }
}