define({ "api": [
  {
    "type": "post",
    "url": "/version",
    "title": "To add a version details.",
    "name": "addVersion",
    "group": "AppDetails",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
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
            "field": "type",
            "description": "<p>Required Device type.</p>"
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
            "field": "VersionDataAlreadyExists",
            "description": "<p>The version data you aretrying to save is already present.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ErrorSavingData",
            "description": "<p>Error while saving data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "VersionDataAlreadyExists-Response:",
          "content": "{\n   success: false,\n   message: 'Version data already exists'\n}",
          "type": "json"
        },
        {
          "title": "ErrorSavingData-Response:",
          "content": "{\n   success: false,\n   message: 'Error while saving data'\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Response : ",
          "content": "{\n   success: true,\n   message: 'Saved successfully'\n}",
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
    "title": "To get latest version .",
    "name": "getLatestVersion",
    "group": "AppDetails",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Required Device type.</p>"
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
          }
        ]
      },
      "examples": [
        {
          "title": "ErrorWhileGettingLatestVersion-Response:",
          "content": "{\n  success: false,\n  message: 'Error while getting latest version'\n}",
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
          "content": "{\n  success: true,\n  version: package version,\n  fileName: Name of the file,\n  fileUrl: URL of package,\n  type: compatable device type,\n  createdOn: created date,\n  checksum: package checksum\n}",
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
          "content": "{\n  success: false,\n  message: 'Error while getting updated versions'\n}",
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
    "title": "To get the list of all versions .",
    "name": "listAllVersions",
    "group": "AppDetails",
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
          "content": "{\n  success: false,\n  message: 'Error while getting versions'\n}",
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
  }
] });
