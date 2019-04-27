## FlowJS

FlowJS is a visual designer to create and manipulate nodes and links between them.

![flow_based_programming](.\docs\images\flow_based_programming.png)

### Table of contents

- [Files](#files)
- [Designer](#designer)
- [Configuration](#configuration)
- [Nodes](#nodes)
- [Events](#events)
- [Controls](#controls)
- [Export](#export)
- [Import](#import)
- [Other](#other)
  - [Changing the scale](#changing-the-scale)
- [Roadmap](#roadmap)

### Files 

FlowJS functionality is split into several files located in `./src`. These files have been combined into `./dist/flow.js` by using the configuration specified in `filepack.config.json`  (filepack on [NPM](https://www.npmjs.com/package/filepack) and [GitHub](https://github.com/DanieLeeuwner/flowjs)).

### Designer

FlowJS defines a Designer class. Minimal initialization requires an HTML element to populate with the visual designer.

HTML element on page:

```html
<div id="container"></div>
```

Initialization in JavaScript:

```js
var designer = new Designer({
  container: container
});
```

### Configuration

The FlowJS designer takes a couple of configuration options.

| Option      | Description                                                  |
| ----------- | ------------------------------------------------------------ |
| `container` | HTML element to display designer. See [Designer](#designer). |
| `scale`     | Initial scale to display. See [Changing the scale](#changing-the-scale). |
| `theme`     | Theme configuration object. See [Theme](#theme).             |
| `callbacks` | Callback events to fire for specific actions. See [Events](#events). |
| `import`    | Nodes and links to import. See [Export](#export).            |
| `width`     | Width of the designer area. Default 5000.                    |
| `height`    | Height of the designer area. Default 5000.                   |

Example of initializing the designer with the default dark theme:

```js
var designer = new Designer({
  container: container,
  scale: 1,
  theme: FlowJS.Theme.Dark
});
```



### Theme

FlowJS defines two basic themes. These are contained within `FlowJS.Theme.Light` and `FlowJS.Theme.Dark` objects (See `./src/_theme.js`). A custom theme object can be used instead of these when initializing a new Designer object.

The theme object contains the following properties:

| Property          | Description                                                  |
| ----------------- | ------------------------------------------------------------ |
| `Grid`            | Color of the grid lines.                                     |
| `Background`      | Color of the grid background.                                |
| `Focus`           | Outline of selected nodes and links.                         |
| `SelectionBorder` | Selection rectangle border color.                            |
| `SelectionFill`   | Selection rectangle background color.                        |
| `Link`            | Array containing colors to randomly assign to links. Default configuration uses an array containing a single color. |
| `ConnectorBorder` | Border color of connection points.                           |
| `ConnectorFill`   | Connector fill color.                                        |
| `Watermark`       | FlowJS watermark color.                                      |

Changes to the theme requires the designer to be refreshed.

```js
designer.theme.Background = '#11FFFF';
designer.refresh();
```

### Nodes

asdf

### Events

asdf

### Controls

asdf

### Export

asdf

### Import

asdf

### Other

#### Changing the scale

```js
designer.scale = 2;
designer.refresh();
```



### Roadmap

| Item                | Description                                                  |
| ------------------- | ------------------------------------------------------------ |
| Dynamic node height | Change the height of nodes to automatically fit longer descriptions |
| Connector popup     | Display a popup next to connectors showing the name          |
|                     |                                                              |

