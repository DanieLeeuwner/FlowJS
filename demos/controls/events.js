var controls = controls || [];

controls.push({
  title: 'listener',
  node: {
    title: 'listener',
    subtitle: 'listen for event',
    type: 'listener',
    outputs: [
      {
        name: 'OUT',
        key: 'event'
      }
    ],
  }
});

controls.push({
  title: 'publisher',
  node: {
    title: 'publisher',
    subtitle: 'publish event',
    type: 'publisher',
    inputs: [
      {
        name: 'IN',
        key: 'event'
      }
    ],
  }
});