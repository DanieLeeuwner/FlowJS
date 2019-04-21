var controls = controls || [];

controls.push({
  title: 'alert',
  node: {
    title: 'alert',
    subtitle: 'display alert box',
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
  title: 'prompt',
  node: {
    title: 'prompt',
    subtitle: 'prompt input value',
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
  title: 'code',
  node: {
    title: 'code',
    subtitle: 'configured code',
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
  title: 'Login',
  node: {
    name: 'Login',
    description: 'User Authentication',
    type: 'code',    
    inputs: [ 'Execute' ]
    outputs: [ 'OnLoginCompleted' ],
    data: {
      code: `console.log(input.value);\nconsole.log(output.value);\nthis.next();`
    }
  }
});