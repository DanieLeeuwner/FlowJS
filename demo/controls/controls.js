var controls = [
  {
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
  },
  {
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
  },
  {
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
  }
];
