var controls = controls || [];
controls = [
  {
    "inputConnections": {
      "Input": []
    },
    "outputConnections": {},
    "configParameters": [
      {
        "name": "Key",
        "type": "String",
        "required": true
      }
    ],
    "id": null,
    "name": "Link Input",
    "description": "Source for flow links"
  },
  {
    "inputConnections": {},
    "outputConnections": {
      "Output": []
    },
    "configParameters": [
      {
        "name": "Key",
        "type": "String",
        "required": true
      }
    ],
    "id": null,
    "name": "Link Output",
    "description": "Target for flow links"
  },
  {
    "inputConnections": {
      "Execute": [
        {
          "name": null,
          "type": "Object",
          "required": true
        }
      ]
    },
    "outputConnections": {
      "OnSuccess": [
        {
          "name": null,
          "type": "Response",
          "required": true
        }
      ],
      "OnError": [
        {
          "name": null,
          "type": "Response",
          "required": true
        }
      ]
    },
    "configParameters": [
      {
        "name": "Headers",
        "type": "Dictionary`2",
        "required": true
      },
      {
        "name": "ProgressMessage",
        "type": "String",
        "required": true
      },
      {
        "name": "DisplayProgress",
        "type": "Boolean",
        "required": true
      },
      {
        "name": "BaseUrl",
        "type": "String",
        "required": true
      },
      {
        "name": "Timeout",
        "type": "Int32",
        "required": true
      },
      {
        "name": "Endpoint",
        "type": "String",
        "required": true
      }
    ],
    "id": null,
    "name": "Http Post",
    "description": "Http Post"
  },
  {
    "inputConnections": {
      "Execute": []
    },
    "outputConnections": {},
    "configParameters": [
      {
        "name": "Headers",
        "type": "Dictionary`2",
        "required": true
      }
    ],
    "id": null,
    "name": "Http Headers",
    "description": "Set Http Headers"
  },
  {
    "inputConnections": {
      "Execute": []
    },
    "outputConnections": {
      "OnSuccess": [
        {
          "name": null,
          "type": "Response",
          "required": true
        }
      ],
      "OnError": [
        {
          "name": null,
          "type": "Response",
          "required": true
        }
      ]
    },
    "configParameters": [
      {
        "name": "Parameters",
        "type": "Dictionary`2",
        "required": true
      },
      {
        "name": "Headers",
        "type": "Dictionary`2",
        "required": true
      },
      {
        "name": "ProgressMessage",
        "type": "String",
        "required": true
      },
      {
        "name": "DisplayProgress",
        "type": "Boolean",
        "required": true
      },
      {
        "name": "BaseUrl",
        "type": "String",
        "required": true
      },
      {
        "name": "Timeout",
        "type": "Int32",
        "required": true
      },
      {
        "name": "Endpoint",
        "type": "String",
        "required": true
      }
    ],
    "id": null,
    "name": "Http Get",
    "description": "Http Get"
  },
  {
    "inputConnections": {
      "Execute": [
        {
          "name": null,
          "type": "Exception",
          "required": false
        },
        {
          "name": null,
          "type": "MessageDialog",
          "required": false
        }
      ]
    },
    "outputConnections": {
      "OnAccept": [],
      "OnCancel": []
    },
    "configParameters": [
      {
        "name": "Title",
        "type": "String",
        "required": true
      },
      {
        "name": "Message",
        "type": "String",
        "required": true
      },
      {
        "name": "Cancel",
        "type": "String",
        "required": true
      },
      {
        "name": "Accept",
        "type": "String",
        "required": true
      }
    ],
    "id": null,
    "name": "Display Message",
    "description": "Display message dialog"
  },
  {
    "inputConnections": {
      "Exectute": [
        {
          "name": "Value",
          "type": "String",
          "required": false
        }
      ]
    },
    "outputConnections": {
      "OnBack": [],
      "OnNext": [
        {
          "name": "Value",
          "type": "String",
          "required": true
        }
      ]
    },
    "configParameters": [
      {
        "name": "RegexValidation",
        "type": "String",
        "required": true
      },
      {
        "name": "Heading",
        "type": "String",
        "required": true
      },
      {
        "name": "Prompt",
        "type": "String",
        "required": true
      },
      {
        "name": "InputType",
        "type": "String",
        "required": true
      },
      {
        "name": "WarningMessage",
        "type": "String",
        "required": true
      },
      {
        "name": "Title",
        "type": "String",
        "required": false
      },
      {
        "name": "BackText",
        "type": "String",
        "required": false
      },
      {
        "name": "NextText",
        "type": "String",
        "required": false
      }
    ],
    "id": null,
    "name": "Value Prompt",
    "description": "Prompt user input"
  },
  {
    "inputConnections": {
      "Execute": [
        {
          "name": null,
          "type": "IEnumerable`1",
          "required": true
        }
      ]
    },
    "outputConnections": {
      "OnItemSelected": [
        {
          "name": null,
          "type": "Object",
          "required": true
        }
      ],
      "OnBack": []
    },
    "configParameters": [
      {
        "name": "RequireConfirmation",
        "type": "Boolean",
        "required": true
      },
      {
        "name": "Title",
        "type": "String",
        "required": false
      },
      {
        "name": "BackText",
        "type": "String",
        "required": false
      },
      {
        "name": "NextText",
        "type": "String",
        "required": false
      }
    ],
    "id": null,
    "name": "List View",
    "description": "Display a list"
  },
  {
    "inputConnections": {
      "Execute": [
        {
          "name": null,
          "type": "Object",
          "required": true
        }
      ]
    },
    "outputConnections": {
      "OnBack": [],
      "OnNext": []
    },
    "configParameters": [
      {
        "name": "Title",
        "type": "String",
        "required": false
      },
      {
        "name": "BackText",
        "type": "String",
        "required": false
      },
      {
        "name": "NextText",
        "type": "String",
        "required": false
      }
    ],
    "id": null,
    "name": "Information Grid",
    "description": "Display information grid"
  },
  {
    "inputConnections": {
      "Execute": [
        {
          "name": "ErrorMessage",
          "type": "String",
          "required": true
        },
        {
          "name": "ErrorTitle",
          "type": "String",
          "required": true
        }
      ]
    },
    "outputConnections": {
      "OnBack": []
    },
    "configParameters": [
      {
        "name": "Title",
        "type": "String",
        "required": false
      },
      {
        "name": "BackText",
        "type": "String",
        "required": false
      },
      {
        "name": "NextText",
        "type": "String",
        "required": false
      }
    ],
    "id": null,
    "name": "System Error",
    "description": "Display system error message"
  },
  {
    "inputConnections": {
      "Execute": [
        {
          "name": null,
          "type": "String",
          "required": true
        }
      ]
    },
    "outputConnections": {
      "OnSubflowCancelled": [],
      "OnSubflowCompleted": [],
      "OnSubflowError": []
    },
    "configParameters": [],
    "id": null,
    "name": "Flow Subflow",
    "description": "Initialize a subflow"
  },
  {
    "inputConnections": {
      "Execute": []
    },
    "outputConnections": {},
    "configParameters": [],
    "id": null,
    "name": "Flow Cancel",
    "description": "Cancel a flow"
  },
  {
    "inputConnections": {
      "Execute": []
    },
    "outputConnections": {},
    "configParameters": [],
    "id": null,
    "name": "Flow Complete",
    "description": "Complete a flow"
  },
  {
    "inputConnections": {
      "Execute": [
        {
          "name": null,
          "type": "Exception",
          "required": true
        }
      ]
    },
    "outputConnections": {},
    "configParameters": [],
    "id": null,
    "name": "Flow Error",
    "description": "Global flow error"
  },
  {
    "inputConnections": {},
    "outputConnections": {
      "Output": []
    },
    "configParameters": [
      {
        "name": "Configuration",
        "type": "Dictionary`2",
        "required": true
      }
    ],
    "id": null,
    "name": "Flow Start",
    "description": "Start a flow"
  },
  {
    "inputConnections": {
      "Execute": []
    },
    "outputConnections": {
      "OnFlowSelected": [
        {
          "name": null,
          "type": "String",
          "required": true
        }
      ]
    },
    "configParameters": [
      {
        "name": "Title",
        "type": "String",
        "required": false
      },
      {
        "name": "BackText",
        "type": "String",
        "required": false
      },
      {
        "name": "NextText",
        "type": "String",
        "required": false
      }
    ],
    "id": null,
    "name": "Flow List",
    "description": "Display flows on device"
  }
]