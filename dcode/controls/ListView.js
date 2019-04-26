controls.push({
  "name": "ListView",
  "description": "Display a list",
  "type": null,
  "inputs": [
    "Execute"
  ],
  "outputs": [
    "OnItemSelected",
    "OnBack"
  ],
  "configParameters": [
    "RequireConfirmation",
    "Title",
    "BackText",
    "NextText"
  ],
  "inputParameters": [
    {
      "name": "ItemsSource",
      "type": "System.Collections.Generic.IEnumerable"
    }
  ],
  "outputParameters": [
    {
      "name": "SelectedItem",
      "type": "System.Object"
    }
  ]
});