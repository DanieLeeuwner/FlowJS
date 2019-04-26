controls.push({
  "name": "Settings",
  "description": "Device and server settings",
  "type": null,
  "inputs": [
    "Execute"
  ],
  "outputs": [
    "OnSettingsCompleted"
  ],
  "configParameters": [
    "Title",
    "BackText",
    "NextText"
  ],
  "inputParameters": [
    {
      "name": "User",
      "type": "dCode.Models.Core.User"
    }
  ],
  "outputParameters": [
    {
      "name": "User",
      "type": "dCode.Models.Core.User"
    }
  ]
});