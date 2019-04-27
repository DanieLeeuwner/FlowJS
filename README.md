## FlowJS

FlowJS is a visual designer to create and manipulate nodes and links between them.

![flow_based_programming](.\docs\images\flow_based_programming.png)

### Table of contents

- [Files](#files)
- [Designer](#designer)
- [Configuration](#configuration)
- [Nodes](#nodes)
- [Callbacks](#callbacks)
- [Validiation](#validation)
- [Export](#export)
- [Import](#import)
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

| Option       | Description                                                  |
| ------------ | ------------------------------------------------------------ |
| `container`  | HTML element to display designer. See [Designer](#designer). |
| `scale`      | Initial scale to display. Default 1. See [Changing the scale](#changing-the-scale). |
| `theme`      | Theme configuration object. See [Theme](#theme).             |
| `callbacks`  | Callback events to fire for specific actions. See [Callbacks](#callbacks). |
| `validation` | Validation events to fire for specific actions. See [Validation](#validation). |
| `import`     | Nodes and links to import. See [Import](#import).            |
| `width`      | Width of the designer area. Default 5000.                    |
| `height`     | Height of the designer area. Default 5000.                   |

Example of initializing the designer with the default dark theme:

```js
var designer = new Designer({
  container: container,
  theme: FlowJS.Theme.Dark
});
```

Some aspects of the designer are defined within `./src/_config.js`. Like with theme changes, the designer must be refreshed for changes to take effect.

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

Example of changing the background color of the designer:

```js
designer.theme.Background = '#110000';
designer.refresh();
```

### Nodes

Creating a node requires a node object to be passed to the `designer.createNode` function.

Node objects contain the following properties:

| Property      | Description                          |
| ------------- | ------------------------------------ |
| `name`        | Name displayed on the node.          |
| `description` | Description displayed on the node.   |
| `inputs`      | Array of input names.                |
| `outputs`     | Array of output names.               |
| `data`        | Custom node configuration.           |
| `x`           | X coordinate of the node. Default 0. |
| `y`           | Y coordinate of the node. Default 0. |

The designer automatically adds its scroll position values to the provided `x` and `y` values before creating the node.

Example of creating a node with two inputs and two outputs:

```js
var newNode = {
    name: 'Name here',
    description: 'Description here',
    inputs: [ 'In 1', 'In 2' ],
    outputs: [ 'Out 1', 'Out 2' ],
    data: { }
}

designer.createNode(newNode);
```



![flow_based_programming](.\docs\images\basic_node.png)

### Callbacks

Callbacks can be specified as part of the designer initialization process. These callbacks allow rules to be applied to the process. See [Configuration](#configuration).

All callback events should be functions that expect the specified parameter. 

| Callback         | Parameter | Description                        |
| ---------------- | --------- | ---------------------------------- |
| `linkCreated`    | Link      | Link is created between two nodes. |
| `linkSelected`   | Link      | Link is selected.                  |
| `linkUnselected` | Link      | Link is unselected.                |
| `linkDeleted`    | Link      | Link is deleted.                   |
| `nodeSelected`   | Node[]    | Node is selected.                  |
| `nodeUnselected` | Node[]    | Node is unselected.                |
| `nodeDeleted`    | Node[]    | Node is deleted.                   |
| `nodeOpened`     | Node[]    | A selected node is clicked.        |
| `nodeMoved`      | Node[]    | Node is moved.                     |

### Validation

Validation actions 

### Controls

asdf

### Export

asdf

### Import

asdf

### Roadmap

| Item                | Description                                                  |
| ------------------- | ------------------------------------------------------------ |
| Dynamic node height | Change the height of nodes to automatically fit longer descriptions |
| Connector popup     | Display a popup next to connectors showing the name          |
|                     |                                                              |

