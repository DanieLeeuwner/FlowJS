var controls = controls || [];
controls = [
  {
    "foregroundColor": null,
    "inputs": [
      "Input"
    ],
    "outputs": [],
    "configParameters": [
      "Key"
    ],
    "inputParameters": [],
    "outputParameters": [],
    "id": null,
    "name": "Link Input",
    "description": "Source for flow links",
    "type": "Link",
    "category": "Flow",
    "backgroundColor": "#70AE98"
  },
  {
    "foregroundColor": null,
    "inputs": [],
    "outputs": [
      "Output"
    ],
    "configParameters": [
      "Key"
    ],
    "inputParameters": [],
    "outputParameters": [],
    "id": null,
    "name": "Link Output",
    "description": "Target for flow links",
    "type": "Link",
    "category": "Flow",
    "backgroundColor": "#70AE98"
  },
  {
    "foregroundColor": null,
    "inputs": [
      "Execute"
    ],
    "outputs": [
      "OnSuccess",
      "OnError"
    ],
    "configParameters": [
      "Headers",
      "ProgressMessage",
      "DisplayProgress",
      "BaseUrl",
      "Timeout",
      "Endpoint"
    ],
    "inputParameters": [
      {
        "name": "Data",
        "type": "System.Object"
      }
    ],
    "outputParameters": [
      {
        "name": "Response",
        "type": "dCode.Common.Http.Response"
      },
      {
        "name": "Exception",
        "type": "System.Exception"
      }
    ],
    "id": null,
    "name": "Http Post",
    "description": "Http Post",
    "type": "Process",
    "category": "Internet",
    "backgroundColor": "#9DABDD"
  },
  {
    "foregroundColor": null,
    "inputs": [
      "Execute"
    ],
    "outputs": [],
    "configParameters": [
      "Headers"
    ],
    "inputParameters": [],
    "outputParameters": [],
    "id": null,
    "name": "Http Headers",
    "description": "Set Http Headers",
    "type": "Configuration",
    "category": "Internet",
    "backgroundColor": "#9DABDD"
  },
  {
    "foregroundColor": null,
    "inputs": [
      "Execute"
    ],
    "outputs": [
      "OnSuccess",
      "OnError"
    ],
    "configParameters": [
      "Parameters",
      "Headers",
      "ProgressMessage",
      "DisplayProgress",
      "BaseUrl",
      "Timeout",
      "Endpoint"
    ],
    "inputParameters": [],
    "outputParameters": [
      {
        "name": "Response",
        "type": "dCode.Common.Http.Response"
      },
      {
        "name": "Exception",
        "type": "System.Exception"
      }
    ],
    "id": null,
    "name": "Http Get",
    "description": "Http Get",
    "type": "Process",
    "category": "Internet",
    "backgroundColor": "#9DABDD"
  },
  {
    "foregroundColor": null,
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
        "name": "Exception",
        "type": "System.Exception"
      },
      {
        "name": "MessageDialog",
        "type": "dCode.Xamarin.Common.Entities.MessageDialog"
      }
    ],
    "outputParameters": [],
    "id": null,
    "name": "Display Message",
    "description": "Display message dialog",
    "type": "Process",
    "category": "Native",
    "backgroundColor": "#E18D96"
  },
  {
    "foregroundColor": null,
    "inputs": [
      "Exectute"
    ],
    "outputs": [
      "OnBack",
      "OnNext"
    ],
    "configParameters": [
      "RegexValidation",
      "Heading",
      "Prompt",
      "InputType",
      "WarningMessage",
      "Title",
      "BackText",
      "NextText"
    ],
    "inputParameters": [
      {
        "name": "Value",
        "type": "System.String"
      }
    ],
    "outputParameters": [
      {
        "name": "Value",
        "type": "System.String"
      }
    ],
    "id": null,
    "name": "Value Prompt",
    "description": "Prompt user input",
    "type": "View",
    "category": "Input",
    "backgroundColor": "#E18D96"
  },
  {
    "foregroundColor": null,
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
    ],
    "id": null,
    "name": "List View",
    "description": "Display a list",
    "type": "View",
    "category": "Display",
    "backgroundColor": "#E18D96"
  },
  {
    "foregroundColor": null,
    "inputs": [
      "Execute"
    ],
    "outputs": [
      "OnBack",
      "OnNext"
    ],
    "configParameters": [
      "Title",
      "BackText",
      "NextText"
    ],
    "inputParameters": [
      {
        "name": "Data",
        "type": "System.Object"
      },
      {
        "name": "Response",
        "type": "dCode.Common.Http.Response"
      }
    ],
    "outputParameters": [],
    "id": null,
    "name": "Information Grid",
    "description": "Display information grid",
    "type": "View",
    "category": "Display",
    "backgroundColor": "#E18D96"
  },
  {
    "foregroundColor": null,
    "inputs": [
      "Execute"
    ],
    "outputs": [
      "OnBack"
    ],
    "configParameters": [
      "Title",
      "BackText",
      "NextText"
    ],
    "inputParameters": [
      {
        "name": "Response",
        "type": "dCode.Common.Http.Response"
      }
    ],
    "outputParameters": [],
    "id": null,
    "name": "Weather",
    "description": "Display weather data",
    "type": "View",
    "category": "Functionality",
    "backgroundColor": "#E08963"
  },
  {
    "foregroundColor": null,
    "inputs": [
      "Execute"
    ],
    "outputs": [
      "OnBack"
    ],
    "configParameters": [
      "ErrorTitle",
      "ErrorMessage",
      "Title",
      "BackText",
      "NextText"
    ],
    "inputParameters": [],
    "outputParameters": [],
    "id": null,
    "name": "System Error",
    "description": "Display system error message",
    "type": "Internal",
    "category": "Functionality",
    "backgroundColor": "#E08963"
  },
  {
    "foregroundColor": null,
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
    ],
    "id": null,
    "name": "Settings",
    "description": "Device and server settings",
    "type": "View",
    "category": "Functionality",
    "backgroundColor": "#E08963"
  },
  {
    "foregroundColor": null,
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
    ],
    "id": null,
    "name": "Login",
    "description": "User authentication",
    "type": "View",
    "category": "Functionality",
    "backgroundColor": "#E08963"
  },
  {
    "foregroundColor": null,
    "inputs": [
      "Execute"
    ],
    "outputs": [
      "OnSubflowCancelled",
      "OnSubflowCompleted",
      "OnSubflowError"
    ],
    "configParameters": [],
    "inputParameters": [
      {
        "name": "Path",
        "type": "System.String"
      }
    ],
    "outputParameters": [],
    "id": null,
    "name": "Flow Subflow",
    "description": "Initialize a subflow",
    "type": "Process",
    "category": "Functionality",
    "backgroundColor": "#2E8364"
  },
  {
    "foregroundColor": null,
    "inputs": [
      "Execute"
    ],
    "outputs": [],
    "configParameters": [],
    "inputParameters": [],
    "outputParameters": [],
    "id": null,
    "name": "Flow Cancel",
    "description": "Cancel a flow",
    "type": "Process",
    "category": "Functionality",
    "backgroundColor": "#2E8364"
  },
  {
    "foregroundColor": null,
    "inputs": [
      "Execute"
    ],
    "outputs": [],
    "configParameters": [],
    "inputParameters": [],
    "outputParameters": [],
    "id": null,
    "name": "Flow Complete",
    "description": "Complete a flow",
    "type": "Process",
    "category": "Functionality",
    "backgroundColor": "#2E8364"
  },
  {
    "foregroundColor": null,
    "inputs": [
      "Execute"
    ],
    "outputs": [],
    "configParameters": [],
    "inputParameters": [],
    "outputParameters": [],
    "id": null,
    "name": "Flow Error",
    "description": "Global flow error",
    "type": "Process",
    "category": "Functionality",
    "backgroundColor": "#2E8364"
  },
  {
    "foregroundColor": null,
    "inputs": [],
    "outputs": [
      "Output"
    ],
    "configParameters": [
      "Configuration"
    ],
    "inputParameters": [],
    "outputParameters": [],
    "id": null,
    "name": "Flow Start",
    "description": "Start a flow",
    "type": "Process",
    "category": "Functionality",
    "backgroundColor": "#2E8364"
  },
  {
    "foregroundColor": null,
    "inputs": [
      "Execute"
    ],
    "outputs": [
      "OnFlowSelected"
    ],
    "configParameters": [
      "Title",
      "BackText",
      "NextText"
    ],
    "inputParameters": [],
    "outputParameters": [
      {
        "name": "Path",
        "type": "System.String"
      }
    ],
    "id": null,
    "name": "Flow List",
    "description": "Display flows on device",
    "type": "View",
    "category": "Functionality",
    "backgroundColor": "#ECAD8F"
  }
]