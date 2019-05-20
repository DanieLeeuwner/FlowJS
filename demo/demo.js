var controls = controls || [];
var tempElement;

var designer = new Designer({
  container: container,
  //import: JSON.parse(localStorage.getItem('import')),
  scale: 1,
  theme: FlowJS.Theme.Dark,
  callbacks: {
    linkCreated: (e) => { console.log('linkCreated'); console.log(e); },
    linkSelected: (e) => { console.log('linkSelected'); console.log(e); },
    linkUnselected: (e) => { console.log('linkUnselected'); console.log(e); },
    linkDeleted: (e) => { console.log('linkDeleted'); console.log(e); },
    nodeSelected: (e) => { console.log('nodeSelected'); console.log(e); },
    nodeUnselected: (e) => { console.log('nodeUnselected'); console.log(e); },
    nodeMoved: (e) => { console.log('nodeMoved'); console.log(e); },
    nodeOpened: (e) => { console.log('nodeOpened'); console.log(e); nodeSelected(e); },
    nodeDeleted: (e) => { console.log('nodeDeleted'); console.log(e); }
  },
  validation: {
    linkCreate: (source, target) => { console.log('linkCreate validation'); console.log(source); console.log(target); return true; },
    linkDelete: (link) => { console.log('linkDelete validation'); console.log(link); return true; },
    nodeDelete: (nodes) => { console.log('nodeDelete validation'); console.log(nodes); return true; }
  }
});

registerEvents();
updateControls();

function registerEvents() {

  codeArea.addEventListener('keydown', inputKeyDown);

  popup.addEventListener('mousedown', (e) => {
    e.stopPropagation();

    if (e.target == codeArea) {
      return;
    }

    currentNode.data = JSON.parse(codeArea.value);

    hideCode();
  });

  document.addEventListener('mouseup', (e) => {
    if (tempElement == undefined) return;

    var control = tempElement.control;

    container.removeChild(tempElement);

    var x = e.pageX - 200;
    var y = e.pageY;

    if (x < 0 || y < 0) return;

    x -= tempElement.initialX;
    y -= tempElement.initialY;

    x /= designer.scale;
    y /= designer.scale;

    var node = JSON.parse(JSON.stringify(control));

    console.log(node);

    node.inputs = [];
    for (var inputConnection in node.inputConnections) {
      node.inputs.push(inputConnection);
    }

    node.outputs = [];
    for (var outputConnection in node.outputConnections) {
      node.outputs.push(outputConnection);
    }

    node.data = {};
    node.configParameters = node.configParameters || [];

    for (var config of node.configParameters) {
      config.value = 'value';
      node.data[config.name] = config;
    }

    node.x = x;
    node.y = y;

    designer.createNode(node);

    tempElement = undefined;
  });

  document.addEventListener('mousemove', (e) => {
    if (tempElement == undefined) return;

    e.stopPropagation();
    e.preventDefault();

    tempElement.style.top = e.clientY - tempElement.initialY + 'px';
    tempElement.style.left = e.clientX - tempElement.initialX + 'px';
  });
}

function updateControls() {
  if (controls == undefined) return;

  controlsArea.innerHTML = '';

  controls = _.orderBy(controls, ['Type'], ['asc']);

  for (var i = 0; i < controls.length; i++) {
    var control = controls[i];

    var element = createDisplayNode(control);
    controlsArea.appendChild(element);

    element.addEventListener('mousedown', (e) => {
      var element = e.target;

      tempElement = createDisplayNode(element.control);
      tempElement.className = 'control move';

      tempElement.initialY = e.layerY;
      tempElement.initialX = e.layerX;

      tempElement.style.top = e.clientY - tempElement.initialY + 'px';
      tempElement.style.left = e.clientX - tempElement.initialX + 'px';

      container.appendChild(tempElement);
    });
  }
}

function createDisplayNode(control) {
  var element = document.createElement('div');

  element.className = 'control';
  element.innerHTML = control.name;
  element.control = control;

  if (control.backgroundColor) {
    element.style.backgroundColor = control.backgroundColor;
  }

  return element;
}

var currentNode = undefined;

function nodeUnselected(nodes) {
  currentNode = undefined;
}

function nodeSelected(node) {
  currentNode = node;
  showCode(JSON.stringify(currentNode.data, null, 4));
}

function setCode(value) {
  codeArea.value = value;
}

function showCode(value) {
  if (value != undefined) {
    setCode(value);
  }
  popup.className = 'shown';
}

function hideCode() {
  popup.className = 'hidden';
}

function inputKeyDown(e) {
  if (currentNode == undefined) return;

  switch (e.keyCode) {
    case 9: // tab
      e.preventDefault();
      codeArea.insertAtCaret('    ');
      break;

    case 27: // esc
      hideCode();
      break;
  }
}

var eventListeners = {};

var demoData;

function run() {
  eventListeners = {};

  demoData = designer.export();

  for (var i = 0; i < demoData.nodes.length; i++) {
    var node = demoData.nodes[i];

    switch (node.type) {
      case 'event':
        if (node.inputs.length > 0) {
          node.execute = (node, data) => {
            executeEvent(node.data.event, node.data.output);
          }
        } else {
          registerEvent(node, node.data.event, (node, input) => {
            var links = getLinks(node.id + '.' + node.outputs[0].id);
            executeLinks(links, node.data.output);
          });
        }
        break;
      case 'code':
        node.execute = (node, data) => {
          var output = {};

          var next = (key) => {
            if (node.outputs == undefined || node.outputs.length == 0) return;

            if (key == undefined) {
              key = node.outputs[0].key;
            }

            for (var i = 0; i < node.outputs.length; i++) {
              var output = node.outputs[i];
              if (output.key == key) {
                executeLinks(getLinks(node.id + '.' + output.id), output);
              }
            }
          }
          eval(node.data.code);
        }
        break;
    }
  }

  executeEvent('startup');
}

function executeEvent(name, data) {
  if (eventListeners[name] == undefined) return;
  for (var i = 0; i < eventListeners[name].length; i++) {
    var event = eventListeners[name][i];
    event.callback(event.node, data);
  }
}

function registerEvent(node, name, callback) {
  if (eventListeners[name] == undefined) {
    eventListeners[name] = [];
  }
  eventListeners[name].push({ node: node, callback: callback });
}

function getLinks(id) {
  var links = [];
  for (var i = 0; i < demoData.links.length; i++) {
    var link = demoData.links[i];
    if (link.source == id) {
      links.push(link);
    }
  }
  return links;
}

function getNode(id) {
  var nodeId = id.substring(0, 8);
  for (var i = 0; i < demoData.nodes.length; i++) {
    var node = demoData.nodes[i];
    if (node.id == nodeId) {
      return node;
    }
  }
}

function executeLinks(links, data) {
  links.forEach((link) => {
    var node = getNode(link.target);
    node.execute(node, data);
  });
}

HTMLTextAreaElement.prototype.insertAtCaret = function (text) {
  text = text || '';
  if (document.selection) {
    // IE
    this.focus();
    var sel = document.selection.createRange();
    sel.text = text;
  } else if (this.selectionStart || this.selectionStart === 0) {
    // Others
    var startPos = this.selectionStart;
    var endPos = this.selectionEnd;
    this.value = this.value.substring(0, startPos) +
      text +
      this.value.substring(endPos, this.value.length);
    this.selectionStart = startPos + text.length;
    this.selectionEnd = startPos + text.length;
  } else {
    this.value += text;
  }
};
