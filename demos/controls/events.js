var controls = controls || [];

controls.push({
  title: 'event listener',
  node: {
    title: 'listener',
    subtitle: 'listen for event',
    type: 'event',
    outputs: [
      {
        name: 'OUT',
        key: 'event'
      }
    ],
    data: {
      event: 'event_name',
      output: {
        sample_data: true
      }
    }
  }
});

controls.push({
  title: 'event publisher',
  node: {
    title: 'publisher',
    subtitle: 'publish event',
    type: 'event',
    inputs: [
      {
        name: 'IN',
        key: 'event'
      }
    ],
    data: {
      event: 'event_name',
      output: {
        sample_data: true
      }
    }
  }
});