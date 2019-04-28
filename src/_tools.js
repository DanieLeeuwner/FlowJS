var FlowJS = FlowJS || {};

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

    for (var i = 0; i < data.length; i++) {
      output.push(data[i].export());
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

  _containerStyle: undefined,

  ContainerStyle: () => {
    if (FlowJS.Tools._containerStyle) {
      return FlowJS.Tools._containerStyle;
    }

    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML =
     `.FlowJS_Container {
        -webkit-touch-callout: none;
          -webkit-user-select: none;
           -khtml-user-select: none;
             -moz-user-select: none;
              -ms-user-select: none;
                  user-select: none;
      }

      .FlowJS_Container:focus {
        outline: 0;
      }
      `;
    document.getElementsByTagName('head')[0].appendChild(style);

    FlowJS.Tools._containerStyle = 'FlowJS_Container';

    return FlowJS.Tools._containerStyle;
  },

  GetDesigner: (e) => {
    var i = 0;
    while (i < e.path.length && e.path[i].designer == undefined) {
      i++;
    }

    if (i == e.path.length) return undefined;
    return e.path[i].designer;
  },

  GetPosition: (e) => {
    var designer = FlowJS.Tools.GetDesigner(e);
    if (designer == undefined) return;

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
      designer: designer,
      e: e
    }
  },

  SelectRandom: (items) => {
    return items[Math.floor(Math.random() * items.length)];
  },

  BringToFront: (container, element) => {
    container.removeChild(element);
    container.appendChild(element);
  },

  MeasureText: (text, font) => {
    var canvas = FlowJS.Tools.MeasureText.canvas || (FlowJS.Tools.MeasureText.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
  }
}