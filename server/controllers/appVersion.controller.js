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
module.exports = {
  addAppDetails,
  getLatestVersion,
  listAllVersions,
  getUpdatedVersions
};