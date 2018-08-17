let async = require('async');
let appVersionDbo = require('../dbos/appVersion.dbo');


/**
* @api {post} /version To add app details.
* @apiName addVersion
* @apiGroup AppDetails
* @apiParam {Number} version Required Version number of the application.
* @apiParam {String} fileUrl Required File URL of application.
* @apiParam {String} appCode Required App code [SDC/ SNC/ SLC].
* @apiError AppDetailsAlreadyExists The app details you are trying to save is already exist.
*
* @apiErrorExample VersionDataAlreadyExists-Response:
* {
*    success: false,
*    message: 'App details already exists.'
* }
* @apiError ErrorSavingData Error occurred while saving the app details.
* @apiErrorExample ErrorSavingData-Response:
* {
*    success: false,
*    message: 'Error while saving the app details.'
* }
* @apiSuccessExample Response : 
* {
*    success: true,
*    message: 'App details saved successfully.'
* }
*/

let addAppDetails = (req, res) => {
  let details = req.body;
  let { version,
    appCode } = details;
  details.fileName = details.fileUrl.split('/').slice(-1);
  async.waterfall([
    (next) => {
      appVersionDbo.getAppDetails(version, appCode,
        (error, result) => {
          if (error) next({
            status: 500,
            message: 'Error occured while fetching app details.'
          }, null);
          else if (result) next({
            status: 400,
            message: 'App details already exists.'
          }, null);
          else next(null);
        });
    }, (next) => {
      appVersionDbo.addAppDetails(details,
        (error, result) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while saving the app details.'
          }, null);
          else next(null, {
            status: 200,
            message: 'App details saved successfully.'
          });
        });
    }], (error, result) => {
      let response = Object.assign({
        success: !error
      }, error || result);
      let status = response.status;
      delete (response.status);
      res.status(status).send(response);

    });
};

/**
* @api {get} /version/latest To get latest version of an app.
* @apiName getLatestVersion
* @apiGroup AppDetails
* @apiParam {String} appCode Required App code [SDC/ SNC/ SLC].
* @apiError ErrorWhileGettingLatestVersion Error occured while getting latest version
* @apiErrorExample ErrorWhileGettingLatestVersion-Response:
* {
*   success: false,
*   message: 'Error while getting latest version.'
* }
* @apiSuccessExample Response:
* {
*   success: true,
*   version: package version,
*   fileName: Name of the file,
*   fileUrl: URL of package,
*   appCode: compatable device type,
*   createdOn: created date,
*   checksum: package checksum
* }
* @apiError LatestVersionNotFound No latest version found.
* @apiErrorExample latestVersionNotFound-Response : 
* {
*   success: false,
*   message: 'Latest version not found'
* }
*/
let getLatestVersion = (req, res) => {
  let { appCode } = req.query;
  async.waterfall([
    (next) => {
      appVersionDbo.listAllVersions(appCode,
        (error, result) => {
          if (error) next({
            status: 500,
            message: 'Error while getting latest version.'
          }, null);
          else if (result && result.length) {
            result = result[0].toObject();
            next(null, Object.assign({
              status: 200
            }, result));
          } else next({
            status: 400,
            message: 'No latest version found.'
          }, null);
        });
    }], (error, result) => {
      let response = Object.assign({
        success: !error
      }, error || result);
      let status = response.status;
      delete (response.status);
      res.status(status).send(response);
    });
};

/**
* @api {get} /version/list To get the list of all versions.
* @apiName listAllVersions
* @apiGroup AppDetails
* @apiParam {String} appCode Required App code [SDC/ SNC/ SLC].
* @apiError ErrorWhileGettingVersions Error while gettng versions.
* @apiErrorExample ErrorWhileGettingVersions-Response:
* {
*   success: false,
*   message: 'Error while getting versions.'
* }
*  @apiSuccessExample Response : 
* {
*   success: true,
*   list: Array of all version objects
* }
*/
let listAllVersions = (req, res) => {
  let { appCode } = req.query
  async.waterfall([
    (next) => {
      appVersionDbo.listAllVersions(appCode,
        (error, result) => {
          if (error) next({
            status: 500,
            message: 'Error while getting versions.'
          }, null);
          else next(null, {
            status: 200,
            list: result
          });
        });
    }], (error, result) => {
      let response = Object.assign({
        success: !error
      }, error || result);
      let status = response.status;
      delete (response.status);
      res.status(status).send(response);
    });
}

/**
* @api {get} /version/updated To get the list of all updated versions .
* @apiName getUpdatedVersions
* @apiGroup AppDetails
* @apiParam {String} appCode Required App code [SDC/ SNC/ SLC].
* @apiParam {Number} version Required current version.
* @apiError ErrorWhileGettingUpdatedVersions Error while gettng updated versions.
* @apiErrorExample ErrorWhileGettingUpdatedVersions-Response:
* {
*   success: false,
*   message: 'Error while getting updated versions.'
* }
*@apiSuccessExample Response : 
* {
*   success: true,
*   list: Array of all updated version objects.
* }
*/
let getUpdatedVersions = (req, res) => {
  let { version,
    appCode } = req.query;
  async.waterfall([
    (next) => {
      appVersionDbo.getUpdatedVersions(version, appCode,
        (error, result) => {
          if (error) next({
            status: 500,
            message: 'Error while getting updated versions.'
          }, null);
          else next(null, {
            status: 200,
            list: result
          });
        });
    }], (error, result) => {
      let response = Object.assign({
        success: !error
      }, error || result);
      let status = response.status;
      delete (response.status);
      res.status(status).send(response);
    });
}
/**
* @api {post} /message To add a message.
* @apiName addMessage
* @apiGroup Message
* @apiParam {String} message Message to be saved.
* @apiError ErrorWhileAddingMessage Error while adding the message.
* @apiErrorExample ErrorWhileAddingMessage-Response:
* {
*   success: false,
*   message: 'Error while saving message'
* }
*@apiSuccessExample Response : 
* {
*   success: true,
*   list: {
*    "message": "This is the message",
*    "updatedOn": "2018-08-17T12:36:45.361Z"
*   }
* }
*/
let addMessage = (req, res) => {
  let { message } = req.body;
  let updatedOn = Date.now();
  async.waterfall([
    (next) => {
      appVersionDbo.addMessage(message, updatedOn,
        (error, response) => {
          if (error) {
            next({
              status: 500,
              message: 'Error while saving message'
            }, null);
          } else next(null, {
            status: 200,
            list: response
          });
        });
    }], (error, result) => {
      let response = Object.assign({
        success: !error
      }, error || result);
      let status = response.status;
      delete (response.status);
      res.status(status).send(response);
    });
}
/**
* @api {put} /message To update a message.
* @apiName updateMessage
* @apiGroup Message
* @apiParam {String} message Message to be updated.
* @apiParam {String} updatedMessage Updated message.
* @apiError ErrorWhileUpdatingMessage Error while updating the message.
* @apiErrorExample ErrorWhileUpdatingMessage-Response:
* {
*   success: false,
*   message: 'Error while updating message'
* }
*@apiSuccessExample Response : 
* {
*   success: true,
*   message: "Updated successfully"
* }
*/
let updateMessage = (req, res) => {
  let { message,
    updatedMessage } = req.body;
  let updatedOn = Date.now();
  async.waterfall([
    (next) => {
      appVersionDbo.updateMessage(message, updatedMessage, updatedOn,
        (error, response) => {
          if (error) {
            next({
              status: 500,
              message: 'Error while updating message'
            }, null);
          } else next(null, {
            status: 200,
            message: 'Updated successfully',
          });
        });
    }], (error, result) => {
      let response = Object.assign({
        success: !error
      }, error || result);
      let status = response.status;
      delete (response.status);
      res.status(status).send(response);
    });
}
/**
* @api {get} /message To get all available messages.
* @apiName getMessage
* @apiGroup Message
* @apiError ErrorWhileFetchingMessage Error while fetching the messages.
* @apiErrorExample ErrorWhileFetchingMessage-Response:
* {
*   success: false,
*   message: 'Error while fetching message'
* }
*@apiSuccessExample Response : 
* {
*   success: true,
*   list: List of all available messages with updated dates.
* }
*/
let getMessage = (req, res) => {
  async.waterfall([
    (next) => {
      appVersionDbo.getMessage((error, response) => {
        if (error) {
          next({
            status: 500,
            message: 'Error while fetching message'
          }, null);
        } else next(null, {
          status: 200,
          list: response
        });
      });
    }], (error, result) => {
      let response = Object.assign({
        success: !error
      }, error || result);
      let status = response.status;
      delete (response.status);
      res.status(status).send(response);
    });
}

module.exports = {
  addAppDetails,
  getLatestVersion,
  listAllVersions,
  getUpdatedVersions,
  getMessage,
  updateMessage,
  addMessage
};