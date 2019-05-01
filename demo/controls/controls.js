var controls = [
  {
    name: 'entry',
    node: {
      name: 'entry',
      description: 'process entry',
      type: 'entry',
      outputs: [
        {
          name: 'OUT',
        }
      ],
      data: {
      }
    }
  },
  {
    name: 'alert',
    node: {
      name: 'alert',
      description: 'display alert box',
      type: 'code',
      inputs: [
        {
          name: 'IN'
        }
      ],
      data: {
        code: `
let message = msg.value;
alert(message);
`
      }
    }
  },
  {
    name: 'prompt',
    node: {
      name: 'prompt',
      description: 'prompt input value',
      type: 'code',
      inputs: [
        {
          name: 'IN'
        }
      ],
      outputs: [
        {
          name: 'OUT'
        }
      ],
      data: {
        code: `
// read values from payload
let text = msg.text;
let value = msg.value;

// show input prompt
msg.value = prompt(text, value);

// emit payload
next('OUT');
`
      }
    }
  },
  {
    name: 'code',
    node: {
      name: 'code',
      description: 'configured code',
      type: 'code',
      inputs: [
        {
          name: 'IN'
        }
      ],
      outputs: [
        {
          name: 'OUT'
        }
      ],
      data: {
        code: `
console.log(msg);
next('OUT');
`
      }
    }
  }
];
