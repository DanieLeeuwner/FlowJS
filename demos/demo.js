var controls = controls || [];
var tempElement;

var demoDesigner = new Designer({
  container: container,
  scale: 0.8,
  theme: FlowJS.Theme.Dark,
  callbacks: {
    nodeUnselected: (e) => { nodeUnselected(e); },
    nodeOpened: (e) => { nodeSelected(e); },
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

    popup.className = 'hidden';
    demoDesigner.nodeMovementHandler.setSelection();
  });

  document.addEventListener('mouseup', (e) => {
    if (tempElement == undefined) return;

    var control = tempElement.control;

    container.removeChild(tempElement);

    var x = e.layerX - 200 + demoDesigner.designContainer.scrollLeft;
    var y = e.layerY + demoDesigner.designContainer.scrollTop;

    x -= tempElement.ol;
    y -= tempElement.ot;
    
    x /= demoDesigner.scale;
    y /= demoDesigner.scale;

    var node = control.node;

    node.x = x;
    node.y = y;

    demoDesigner.createNode(node);

    tempElement = undefined;
  });

  document.addEventListener('mousemove', (e) => {
    if (tempElement == undefined) return;

    e.stopPropagation();
    e.preventDefault();

    tempElement.style.top = e.clientY - tempElement.ot + 'px';
    tempElement.style.left = e.clientX - tempElement.ol + 'px';
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

      tempElement.ot = e.layerY;
      tempElement.ol = e.layerX;

      tempElement.style.top = e.clientY - tempElement.ot + 'px';
      tempElement.style.left = e.clientX - tempElement.ol + 'px';

      container.appendChild(tempElement);
    });
  }
}

function createDisplayNode(control) {
  var element = document.createElement('div');

  element.className = 'control';
  element.innerHTML = control.title;
  element.control = control;

  return element;
}

function renderTestNode(inputCount, outputCount) {
  var inputs = [];
  var outputs = [];

  for (var i = 0; i < inputCount; i++) {
    inputs.push(new Connector({
      name: 'I:' + (i + 1) 
    }));
  }

  for (var i = 0; i < outputCount; i++) {
    outputs.push(new Connector({
      name: 'O:' + (i + 1)
    }));
  }

  demoDesigner.createNode({
    x: 60,
    y: 60,
    title: `Test ${inputCount} => ${outputCount}`,
    subtitle: 'hi, this is world.',
    inputs: inputs,
    outputs: outputs
  });
}

var currentNode = undefined;

function nodeUnselected(nodes) {
  currentNode = undefined;
}

function nodeSelected(node) {
  currentNode = node;

  if (node.type == 'code') {
    popup.className = 'shown';
  }
}

function inputKeyDown(e) {
  if (currentNode == undefined) return;
 
  if (e.keyCode == 9) {
    e.preventDefault();
    codeArea.insertAtCaret('  ');
  }
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