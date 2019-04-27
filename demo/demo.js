var controls = controls || [];
var tempElement;

var demoDesigner = new Designer({
  container: container,
  scale: 1,
  theme: FlowJS.Theme.Dark,
  callbacks: {
    //nodeUnselected: (e) => { nodeUnselected(e); },
    //nodeOpened: (e) => { nodeSelected(e); },
    linkCreated: (e) => { console.log(e); },
    linkDeleted: (e) => { console.log(e); },
    linkSelected: (e) => { console.log(e); },
    nodeSelected: (e) => { console.log(e); },
    nodeUnselected: (e) => { console.log(e); },
    nodeOpened: (e) => { console.log(e); },
    nodeDeleted: (e) => { console.log(e); },
    nodeMoved: (e) => { console.log(e); }
  },
});

registerEvents();
updateControls();

function registerEvents() {

  codeArea.addEventListener('keydown', inputKeyDown);

  popup.addEventListener('mousedown', (e) => {
    if (e.target == codeArea) {
      e.stopPropagation();
      return;
    }

    switch (currentNode.type) {
      case 'code':
        currentNode.data.code = codeArea.value;
        break;

      case 'event':
        try {
          currentNode.data = JSON.parse(codeArea.value);
        } catch(e) {
          return;
        }
        break;
    }

    hideCode();
    demoDesigner.nodeMovementHandler.setSelection();
  });

  document.addEventListener('mouseup', (e) => {
    if (tempElement == undefined) return;

    var control = tempElement.control;

    container.removeChild(tempElement);

    var x = e.layerX - 200;
    var y = e.layerY;

    x -= tempElement.initialX;
    y -= tempElement.initialY;

    x /= demoDesigner.scale;
    y /= demoDesigner.scale;

    var node = JSON.parse(JSON.stringify(control));
    node.data = {};
    for (var config of node.configParameters) {
      node.data[config] = 'value';
    }

    node.x = x;
    node.y = y;

    demoDesigner.createNode(node);

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
  showCode(JSON.stringify(currentNode.data, null, 2));
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

  if (e.keyCode == 9) {
    e.preventDefault();
    codeArea.insertAtCaret('  ');
  }
}

var eventListeners = {};

var demoData;

function run() {
  eventListeners = {};

  demoData = demoDesigner.export();

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
