var FlowJS = FlowJS || {};

FlowJS.ConnectorStyle = {
  Square: 'Square',
  Round: 'Round',
}

FlowJS.ConnectorType = {
  None: 'None',
  Input: 'Input',
  Output: 'Output',
}

FlowJS.MouseMode = {
  None: 'None',
  Selection: 'Selection',
  Node: 'Node',
  SelectionNodes: 'SelectionNodes',
  Link: 'Link',
}

FlowJS.Config = {
  LinkThickness: 5,
  LinkCurveFactor: 5,

  NodeBorderThickness: 2,
  NodeCursor: 'crosshair',
  
  ConnectorStyle: FlowJS.ConnectorStyle.Square,
  ConnectorFill: false,
  ConnectorCursor: 'crosshair',
  
  GridSize: 25,
  GridEnabled: true,
  GridSnap: true,
  GridCursor: 'crosshair',
  
  ScaleMinimum: 0.2,
  ScaleMaximum: 5,
  
  ControlsEnabled: true,
  
  FontFamily: '"Lucida Console", Monaco, monospace',
  FontSize: 14,
}