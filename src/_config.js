FlowJS.ConnectorStyle = {
  Square: 'Square',
  Round: 'Round',
}

FlowJS.ConnectorType = {
  None: 'None',
  Input: 'Input',
  Output: 'Output',
}

FlowJS.GridStyle = {
  None: 'None',
  Line: 'Line',
  Dot: 'Dot',
}

FlowJS.LinkStyle = {
  Custom: 'Custom',
  Direct: 'Direct',
  Spline: 'Spline',
}

FlowJS.Config = {
  Grid: {
    Style: FlowJS.GridStyle.Line,
    Thickness: 2,
    Enabled: true,
    Size: 20,
    Snap: true,
    Cursor: 'crosshair',
  },

  Node: {
    Thickness: 2,
    Cursor: 'crosshair',
  },

  Connector: {
    Style: FlowJS.ConnectorStyle.Square,
    Fill: false,
    Cursor: 'crosshair'
  },

  Link: {
    Style: FlowJS.LinkStyle.Spline,

    Thickness: 3,
    InitialLength: 20,
    Angle: 45,

    Shadow: {
      Enabled: true,
      Thickness: 8,
      Opacity: 0.2,
      Color: false,
    }
  },

  Scale: {
    Minimum: 0.25,
    Maximum: 2,
  },

  Controls: {
    Enabled: true,
  },

  Font: {
    Family: '"Lucida Console", Monaco, monospace',
    Size: 10,
  }
}