let async = require('async');
let appVersionDbo = require('../dbos/appVersion.dbo');


/**
* @api {post} /version To add a version details.
* @apiName addVersion
* @apiGroup AppDetails
* @apiParam {String} version Required Version number of the application.
* @apiParam {String} fileUrl Required File URL of application.
* @apiParam {String} type Required Device type.
* @apiError VersionDataAlreadyExists The version data you aretrying to save is already present.

* @apiErrorExample VersionDataAlreadyExists-Response:
* {
*    success: false,
*    message: 'Version data already exists'
* }
* @apiError ErrorSavingData Error while saving data
* @apiErrorExample ErrorSavingData-Response:
* {
*    success: false,
*    message: 'Error while saving data'
* }
* @apiSuccessExample Response : 
* {
*    success: true,
*    message: 'Saved successfully'
* }
*/
let addVersion = (req, res) => {
  let details = req.body;
  let { version,
    type } = details;
  details.fileName = details.fileUrl.split('/').slice(-1);
  async.waterfall([
    (next) => {
      appVersionDbo.getAppDetails(version, type,
        (error, result) => {
          if (error) next({
            status: 400,
            message: 'Error occured'
          }, null);
          else if (result) next({
            status: 400,
            message: 'Version data already exists'
          }, null);
          else next(null);
        });
    }, (next) => {
      appVersionDbo.addAppDetails(details,
        (error, result) => {
          if (error) next({
            status: 400,
            message: 'Error while saving data'
          }, null);
          else next(null, {
            status: 200,
            message: 'Saved successfully'
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
* @api {get} /version/latest To get latest version .
* @apiName getLatestVersion
* @apiGroup AppDetails
* @apiParam {String} type Required Device type.
* @apiError ErrorWhileGettingLatestVersion Error occured while getting latest version
* @apiErrorExample ErrorWhileGettingLatestVersion-Response:
* {
*   success: false,
*   message: 'Error while getting latest version'
* }
* @apiSuccessExample Response:
* {
*   success: true,
*   version: package version,
*   fileName: Name of the file,
*   fileUrl: URL of package,
*   type: compatable device type,
*   createdOn: created date,
*   checksum: package checksum
* }
* @apiErrorExample latestVersionNotFound-Response : 
* {
*   success: false,
*   message: 'Latest version not found'
* }
*/
let getLatestVersion = (req, res) => {
  let { type } = req.query;
  async.waterfall([
    (next) => {
      appVersionDbo.listAllVersions(type,
        (error, result) => {
          if (error) next({
            status: 500,
            message: 'Error while getting latest version'
          }, null);
          else if (result && result.length) {
            result = result[0].toObject();
            next(null, Object.assign({
              status: 200
            }, result));
          } else next({
            status: 400,
            message: 'Latest version not found'
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
* @api {get} /version/list To get the list of all versions .
* @apiName listAllVersions
* @apiGroup AppDetails
* @apiParam {String} type Required Device type.
* @apiError ErrorWhileGettingVersions Error while gettng versions.
* @apiErrorExample ErrorWhileGettingVersions-Response:
* {
*   success: false,
*   message: 'Error while getting versions'
* }
*  @apiSuccessExample Response : 
* {
*   success: true,
*   list: Array of all version objects
* }
*/
let listAllVersions = (req, res) => {
  let { type } = req.body
  async.waterfall([
    (next) => {
      appVersionDbo.listAllVersions(type,
        (error, result) => {
          if (error) next({
            status: 500,
            message: 'Error while getting versions'
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
* @apiParam {String} type Required Device type.
* @apiParam {String} version Required current version.
* @apiError ErrorWhileGettingUpdatedVersions Error while gettng updated versions.
* @apiErrorExample ErrorWhileGettingUpdatedVersions-Response:
* {
*   success: false,
*   message: 'Error while getting updated versions'
* }
*@apiSuccessExample Response : 
* {
*   success: true,
*   list: Array of all updated version objects.
* }
*/
let getUpdatedVersions = (req, res) => {
  let { version,
    type } = req.query;
  async.waterfall([
    (next) => {
      appVersionDbo.getUpdatedVersions(version, type,
        (error, result) => {
          if (error) next({
            status: 500,
            message: 'Error while getting updated versions'
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
  addVersion,
  getLatestVersion,
  listAllVersions,
  getUpdatedVersions
};