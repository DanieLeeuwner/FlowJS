var FlowJS = FlowJS || {};

FlowJS.Palette = {
  Pastel: [
    '#FF8B8B',
    '#FFBC6E',
    '#F5FFA2',
    '#AAFFA2',
    '#9FD1FF',
    '#FFAEF7',
  ],
  
  Vibrant: [
    '#FF0000',
    '#FF8100',
    '#FFF400',
    '#22FF00',
    '#0045FF',
    '#FF00E7',
  ],

  DefaultLight: [
    '#333',
  ],

  DefaultDark: [
    '#CCC',
  ],
}

/*

Notes: 
- Make Theme.Light.Grid darker for GridStyle.Dot

*/

FlowJS.Theme = {
  Light: {
    Grid: '#CCC',
    Background: '#FFF',
    Focus: 'orange',
    SelectionBackground: 'rgba(100, 100, 100, 0.2)',
    SelectionBorder: 'rgba(100, 100, 100, 0.8)',
    Link: FlowJS.Palette.DefaultLight,
    ConnectorBorder: '#000',
    ConnectorFill: '#FFF',
    Watermark: 'rgba(51, 51, 51, 0.2)',
  },
  Dark: {
    Grid: '#333',
    Background: '#222',
    Focus: 'orange',
    SelectionBackground: 'rgba(200, 200, 200, 0.2)',
    SelectionBorder: 'rgba(200, 200, 200, 0.8)',
    Link: FlowJS.Palette.DefaultDark,
    ConnectorBorder: '#DDD',
    ConnectorFill: '#FFF',
    Watermark: 'rgba(175, 175, 175, 0.2)',
  },
}
