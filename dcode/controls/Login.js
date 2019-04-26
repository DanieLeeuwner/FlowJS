controls.push({
  "name": "Login",
  "description": "User Authentication",
  "type": null,
  "inputs": [
    "Execute"
  ],
  "outputs": [
    "OnLoginCompleted",
    "OnSettingsRequested"
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