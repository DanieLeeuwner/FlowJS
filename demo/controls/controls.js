var controls = controls || [];
controls = [
  {
    "inputConnections": {
      "Input name 1": [],
      "Input name 2": [],
      "Input name 3": []
    },
    "outputConnections": {
      "Output name 1": [],
      "Output name 2": [],
      "Output name 3": []
    },
    "configParameters": [
      {
        "name": "Key",
        "type": "String",
        "required": true,
        "value": null
      }
    ],
    "id": null,
    "name": "Test link name. This name is long and should span multiple lines when displayed within the node.",
    "description": "Source for flow links"
  },
  {
    "inputConnections": {
      "Input": []
    },
    "outputConnections": {},
    "configParameters": [
      {
        "name": "Key",
        "type": "String",
        "required": true,
        "value": null
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
        "required": true,
        "value": null
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
          "required": true,
          "value": null
        }
      ]
    },
    "outputConnections": {
      "OnSuccess": [
        {
          "name": null,
          "type": "Response",
          "required": true,
          "value": null
        }
      ],
      "OnError": [
        {
          "name": null,
          "type": "Response",
          "required": true,
          "value": null
        }
      ]
    },
    "configParameters": [
      {
        "name": "Headers",
        "type": "Dictionary`2",
        "required": true,
        "value": null
      },
      {
        "name": "ProgressMessage",
        "type": "String",
        "required": true,
        "value": null
      },
      {
        "name": "DisplayProgress",
        "type": "Boolean",
        "required": true,
        "value": null
      },
      {
        "name": "BaseUrl",
        "type": "String",
        "required": true,
        "value": null
      },
      {
        "name": "Timeout",
        "type": "Int32",
        "required": true,
        "value": null
      },
      {
        "name": "Endpoint",
        "type": "String",
        "required": true,
        "value": null
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
        "required": true,
        "value": null
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
          "required": true,
          "value": null
        }
      ],
      "OnError": [
        {
          "name": null,
          "type": "Response",
          "required": true,
          "value": null
        }
      ]
    },
    "configParameters": [
      {
        "name": "Parameters",
        "type": "Dictionary`2",
        "required": true,
        "value": null
      },
      {
        "name": "Headers",
        "type": "Dictionary`2",
        "required": true,
        "value": null
      },
      {
        "name": "ProgressMessage",
        "type": "String",
        "required": true,
        "value": null
      },
      {
        "name": "DisplayProgress",
        "type": "Boolean",
        "required": true,
        "value": null
      },
      {
        "name": "BaseUrl",
        "type": "String",
        "required": true,
        "value": null
      },
      {
        "name": "Timeout",
        "type": "Int32",
        "required": true,
        "value": null
      },
      {
        "name": "Endpoint",
        "type": "String",
        "required": true,
        "value": null
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
          "required": false,
          "value": null
        },
        {
          "name": null,
          "type": "MessageDialog",
          "required": false,
          "value": null
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
        "required": false,
        "value": null
      },
      {
        "name": "Message",
        "type": "String",
        "required": false,
        "value": null
      },
      {
        "name": "Cancel",
        "type": "String",
        "required": false,
        "value": null
      },
      {
        "name": "Accept",
        "type": "String",
        "required": false,
        "value": null
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
          "required": false,
          "value": null
        }
      ]
    },
    "outputConnections": {
      "OnBack": [],
      "OnNext": [
        {
          "name": "Value",
          "type": "String",
          "required": true,
          "value": null
        }
      ]
    },
    "configParameters": [
      {
        "name": "RegexValidation",
        "type": "String",
        "required": false,
        "value": null
      },
      {
        "name": "Heading",
        "type": "String",
        "required": true,
        "value": null
      },
      {
        "name": "Prompt",
        "type": "String",
        "required": true,
        "value": null
      },
      {
        "name": "InputType",
        "type": "String",
        "required": false,
        "value": null
      },
      {
        "name": "WarningMessage",
        "type": "String",
        "required": false,
        "value": null
      },
      {
        "name": "Title",
        "type": "String",
        "required": false,
        "value": null
      },
      {
        "name": "BackText",
        "type": "String",
        "required": false,
        "value": null
      },
      {
        "name": "NextText",
        "type": "String",
        "required": false,
        "value": null
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
          "required": true,
          "value": null
        }
      ]
    },
    "outputConnections": {
      "OnItemSelected": [
        {
          "name": null,
          "type": "Object",
          "required": true,
          "value": null
        }
      ],
      "OnBack": []
    },
    "configParameters": [
      {
        "name": "RequireConfirmation",
        "type": "Boolean",
        "required": true,
        "value": null
      },
      {
        "name": "Title",
        "type": "String",
        "required": false,
        "value": null
      },
      {
        "name": "BackText",
        "type": "String",
        "required": false,
        "value": null
      },
      {
        "name": "NextText",
        "type": "String",
        "required": false,
        "value": null
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
          "required": true,
          "value": null
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
        "required": false,
        "value": null
      },
      {
        "name": "BackText",
        "type": "String",
        "required": false,
        "value": null
      },
      {
        "name": "NextText",
        "type": "String",
        "required": false,
        "value": null
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
          "required": true,
          "value": null
        },
        {
          "name": "ErrorTitle",
          "type": "String",
          "required": true,
          "value": null
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
        "required": false,
        "value": null
      },
      {
        "name": "BackText",
        "type": "String",
        "required": false,
        "value": null
      },
      {
        "name": "NextText",
        "type": "String",
        "required": false,
        "value": null
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
          "required": true,
          "value": null
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
          "required": true,
          "value": null
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
        "required": true,
        "value": null
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
          "required": true,
          "value": null
        }
      ]
    },
    "configParameters": [
      {
        "name": "Title",
        "type": "String",
        "required": false,
        "value": null
      },
      {
        "name": "BackText",
        "type": "String",
        "required": false,
        "value": null
      },
      {
        "name": "NextText",
        "type": "String",
        "required": false,
        "value": null
      }
    ],
    "id": null,
    "name": "Flow List",
    "description": "Display flows on device"
  },
  {
    "inputConnections": {
      "Execute": [
        {
          "name": null,
          "type": "PurchaseOrder",
          "required": true,
          "value": null
        }
      ]
    },
    "outputConnections": {
      "OnError": [
        {
          "name": null,
          "type": "Exception",
          "required": true,
          "value": null
        }
      ],
      "OnComplete": [
        {
          "name": null,
          "type": "String",
          "required": true,
          "value": null
        }
      ]
    },
    "configParameters": [],
    "id": null,
    "name": "Save PO",
    "description": "Save PO To server"
  },
  {
    "inputConnections": {
      "Execute": [
        {
          "name": null,
          "type": "PurchaseOrderItem",
          "required": true,
          "value": null
        }
      ]
    },
    "outputConnections": {},
    "configParameters": [],
    "id": null,
    "name": "Print Barcode",
    "description": "Print barcode"
  },
  {
    "inputConnections": {
      "Execute": [
        {
          "name": "Value",
          "type": "String",
          "required": true,
          "value": null
        }
      ]
    },
    "outputConnections": {
      "OnError": [
        {
          "name": null,
          "type": "Exception",
          "required": true,
          "value": null
        }
      ],
      "OnComplete": [
        {
          "name": null,
          "type": "PurchaseOrder",
          "required": true,
          "value": null
        }
      ]
    },
    "configParameters": [],
    "id": null,
    "name": "Get PO",
    "description": "Get PO from SAP"
  },
  {
    "inputConnections": {
      "Execute": [
        {
          "name": null,
          "type": "PurchaseOrder",
          "required": true,
          "value": null
        }
      ]
    },
    "outputConnections": {
      "OnBack": [],
      "OnNext": [
        {
          "name": null,
          "type": "PurchaseOrderItem",
          "required": true,
          "value": null
        }
      ]
    },
    "configParameters": [
      {
        "name": "Title",
        "type": "String",
        "required": false,
        "value": null
      },
      {
        "name": "BackText",
        "type": "String",
        "required": false,
        "value": null
      },
      {
        "name": "NextText",
        "type": "String",
        "required": false,
        "value": null
      }
    ],
    "id": null,
    "name": "Display PO Item List",
    "description": "Display PO Item List"
  },
  {
    "inputConnections": {
      "Execute": [
        {
          "name": null,
          "type": "PurchaseOrderItem",
          "required": true,
          "value": null
        }
      ]
    },
    "outputConnections": {
      "OnNext": [],
      "OnBack": []
    },
    "configParameters": [
      {
        "name": "Title",
        "type": "String",
        "required": false,
        "value": null
      },
      {
        "name": "BackText",
        "type": "String",
        "required": false,
        "value": null
      },
      {
        "name": "NextText",
        "type": "String",
        "required": false,
        "value": null
      }
    ],
    "id": null,
    "name": "Display PO Item",
    "description": "Display PO Item"
  },
  {
    "inputConnections": {
      "Execute": [
        {
          "name": null,
          "type": "PurchaseOrder",
          "required": true,
          "value": null
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
        "required": false,
        "value": null
      },
      {
        "name": "BackText",
        "type": "String",
        "required": false,
        "value": null
      },
      {
        "name": "NextText",
        "type": "String",
        "required": false,
        "value": null
      }
    ],
    "id": null,
    "name": "Display PO Header",
    "description": "Display PO "
  }
]