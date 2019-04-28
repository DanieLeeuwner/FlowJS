var controls = controls || [];

controls.push({
  name: 'alert',
  node: {
    name: 'alert',
    description: 'display alert box',
    type: 'code',
    inputs: [
      {
        name: 'IN',
        key: 'text'
      }
    ],
    data: {
      code: `alert('hello world');`
    }
  }
});

controls.push({
  name: 'prompt',
  node: {
    name: 'prompt',
    description: 'prompt input value',
    type: 'code',
    inputs: [
      {
        name: 'IN',
        key: 'text'
      }
    ],
    outputs: [
      {
        name: 'OUT',
        key: 'value'
      }
    ],
    data: {
      code: `output.value = prompt(input.text);\nthis.next();`
    }
  }
});

controls.push({
  name: 'code',
  node: {
    name: 'code',
    description: 'configured code',
    type: 'code',
    inputs: [
      {
        name: 'IN',
        key: 'value'
      }
    ],
    outputs: [
      {
        name: 'OUT',
        key: 'value'
      }
    ],
    data: {
      code: `console.log(input.value);\nconsole.log(output.value);\nthis.next();`
    }
  }
});

controls.push({
  name: 'FLOW',
  node: {
    name: 'FLOW',
    description: '',
    type: 'code',
    inputs: [ ],
    outputs: [ 'OUT' ],
    data: {
      code: `console.log(input.value);\nconsole.log(output.value);\nthis.next();`
    }
  }
});

controls.push({
  name: 'BASED',
  node: {
    name: 'BASED',
    description: '',
    type: 'code',
    inputs: [ 'IN' ],
    outputs: [ 'OUT' ],
    data: {
      code: `console.log(input.value);\nconsole.log(output.value);\nthis.next();`
    }
  }
});

controls.push({
  name: 'PROGRAMMING',
  node: {
    name: 'PROGRAMMING',
    description: '',
    type: 'code',
    inputs: [ 'IN' ],
    outputs: [  ],
    data: {
      code: `console.log(input.value);\nconsole.log(output.value);\nthis.next();`
    }
  }
});

controls.push({
  name: 'FlowJS',
  node: {
    name: 'FlowJS',
    description: '',
    type: 'code',
    inputs: [ 'IN' ],
    outputs: [ 'OUT' ],
    data: {
      code: `console.log(input.value);\nconsole.log(output.value);\nthis.next();`
    }
  }
});

controls.push({
  name: 'name goes here',
  node: {
    name: 'Name here',
    description: 'Description here',
    type: 'code',
    inputs: [ 'In 1', 'In 2' ],
    outputs: [ 'Out 1', 'Out 2' ],
    data: {
      code: `console.log(input.value);\nconsole.log(output.value);\nthis.next();`
    }
  }
});