var controls = controls || [];

controls.push({
  title: 'alert',
  node: {
    title: 'alert',
    subtitle: 'display alert box',
    type: 'alert',
    inputs: [
      {
        name: 'IN',
        key: 'text'
      }
    ],
    data: {
      code: `
        alert(input.text);
        next();
      `
    }
  }
});

controls.push({
  title: 'prompt',
  node: {
    title: 'prompt',
    subtitle: 'prompt input value',
    type: 'prompt',    
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
      code: `
        output.value = prompt(input.text);
        next();
      `
    }
  }
});