define({ "api": [
  {
    "type": "post",
    "url": "/version",
    "title": "To add app details.",
    "name": "addVersion",
    "group": "AppDetails",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "version",
            "description": "<p>Required Version number of the application.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "fileUrl",
            "description": "<p>Required File URL of application.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "appCode",
            "description": "<p>Required App code [SDC/ SNC/ SLC].</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AppDetailsAlreadyExists",
            "description": "<p>The app details you are trying to save is already exist.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ErrorSavingData",
            "description": "<p>Error occurred while saving the app details.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "VersionDataAlreadyExists-Response:",
          "content": "{\n   success: false,\n   message: 'App details already exists.'\n}",
          "type": "json"
        },
        {
          "title": "ErrorSavingData-Response:",
          "content": "{\n   success: false,\n   message: 'Error while saving the app details.'\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Response : ",
          "content": "{\n   success: true,\n   message: 'App details saved successfully.'\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/controllers/appVersion.controller.js",
    "groupTitle": "AppDetails"
  },
  {
    "type": "get",
    "url": "/version/latest",
    "title": "To get latest version of an app.",
    "name": "getLatestVersion",
    "group": "AppDetails",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "appCode",
            "description": "<p>Required App code [SDC/ SNC/ SLC].</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ErrorWhileGettingLatestVersion",
            "description": "<p>Error occured while getting latest version</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "LatestVersionNotFound",
            "description": "<p>No latest version found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ErrorWhileGettingLatestVersion-Response:",
          "content": "{\n  success: false,\n  message: 'Error while getting latest version.'\n}",
          "type": "json"
        },
        {
          "title": "latestVersionNotFound-Response : ",
          "content": "{\n  success: false,\n  message: 'Latest version not found'\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Response:",
          "content": "{\n  success: true,\n  version: package version,\n  fileName: Name of the file,\n  fileUrl: URL of package,\n  appCode: compatable device type,\n  createdOn: created date,\n  checksum: package checksum\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/controllers/appVersion.controller.js",
    "groupTitle": "AppDetails"
  },
  {
    "type": "get",
    "url": "/version/updated",
    "title": "To get the list of all updated versions .",
    "name": "getUpdatedVersions",
    "group": "AppDetails",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "appCode",
            "description": "<p>Required App code [SDC/ SNC/ SLC].</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "version",
            "description": "<p>Required current version.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ErrorWhileGettingUpdatedVersions",
            "description": "<p>Error while gettng updated versions.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ErrorWhileGettingUpdatedVersions-Response:",
          "content": "{\n  success: false,\n  message: 'Error while getting updated versions.'\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Response : ",
          "content": "{\n  success: true,\n  list: Array of all updated version objects.\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/controllers/appVersion.controller.js",
    "groupTitle": "AppDetails"
  },
  {
    "type": "get",
    "url": "/version/list",
    "title": "To get the list of all versions.",
    "name": "listAllVersions",
    "group": "AppDetails",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "appCode",
            "description": "<p>Required App code [SDC/ SNC/ SLC].</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ErrorWhileGettingVersions",
            "description": "<p>Error while gettng versions.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ErrorWhileGettingVersions-Response:",
          "content": "{\n  success: false,\n  message: 'Error while getting versions.'\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Response : ",
          "content": "{\n  success: true,\n  list: Array of all version objects\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/controllers/appVersion.controller.js",
    "groupTitle": "AppDetails"
  },
  {
    "type": "post",
    "url": "/message",
    "title": "To add a message.",
    "name": "addMessage",
    "group": "Message",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Message to be saved.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ErrorWhileAddingMessage",
            "description": "<p>Error while adding the message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ErrorWhileAddingMessage-Response:",
          "content": "{\n  success: false,\n  message: 'Error while saving message'\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Response : ",
          "content": "{\n  success: true,\n  list: {\n   \"message\": \"This is the message\",\n   \"updatedOn\": \"2018-08-17T12:36:45.361Z\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/controllers/appVersion.controller.js",
    "groupTitle": "Message"
  },
  {
    "type": "get",
    "url": "/message",
    "title": "To get all available messages.",
    "name": "getMessage",
    "group": "Message",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ErrorWhileFetchingMessage",
            "description": "<p>Error while fetching the messages.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ErrorWhileFetchingMessage-Response:",
          "content": "{\n  success: false,\n  message: 'Error while fetching message'\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Response : ",
          "content": "{\n  success: true,\n  list: List of all available messages with updated dates.\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/controllers/appVersion.controller.js",
    "groupTitle": "Message"
  },
  {
    "type": "put",
    "url": "/message",
    "title": "To update a message.",
    "name": "updateMessage",
    "group": "Message",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Message to be updated.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "updatedMessage",
            "description": "<p>Updated message.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ErrorWhileUpdatingMessage",
            "description": "<p>Error while updating the message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ErrorWhileUpdatingMessage-Response:",
          "content": "{\n  success: false,\n  message: 'Error while updating message'\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Response : ",
          "content": "{\n  success: true,\n  message: \"Updated successfully\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/controllers/appVersion.controller.js",
    "groupTitle": "Message"
  }
] });
