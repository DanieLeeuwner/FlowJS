controls.push({
  "name": "DisplayMessage",
  "description": "Display message dialog",
  "type": null,
  "inputs": [
    "Execute"
  ],
  "outputs": [
    "OnAccept",
    "OnCancel"
  ],
  "configParameters": [
    "Title",
    "Message",
    "Cancel",
    "Accept"
  ],
  "inputParameters": [
    {
      "name": "MessageDialog",
      "type": "dCode.Xamarin.Common.Entities.MessageDialog"
    }
  ],
  "outputParameters": []
});