let async = require('async');
let appVersionDbo = require('../dbos/appVersion.dbo');


/**
* @api {post} /version To add a version details.
* @apiName addVersion
* @apiGroup AppDetails
* @apiParam {String} versionNumber Required Version number of the application.
  @apiParam {String} fileUrl Required File URL of application.
* @apiError VersionDataAlreadyExists The version data you aretrying to save is already present.

* @apiErrorExample VersionDataAlreadyExists-Response:
* {
*    status: 400,
*    message: 'Version data already exists'
* }
* @apiError ErrorSavingData Error while saving data
* @apiErrorExample ErrorSavingData-Response:
* {
*    status: 400,
*    message: 'Error while saving data'
* }
* @apiSuccessExample Response : 
* {
*    status: 200,
*    message: 'Saved successfully'
* }
*/
let addVersion = (req, res) => {
  let details = req.body;
  let { version } = details;
  details.fileName = details.fileUrl.split('/').slice(-1);
  async.waterfall([
    (next) => {
      appVersionDbo.getAppDetails(version, 'm',
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
* @apiError VersionDataAlreadyExists The version data you aretrying to save is already present.
* @apiErrorExample ErrorWhileGettingLatestVersion-Response:
* {
*   status: 500,
*   message: 'Error while getting latest version'
* }
* @apiSuccess {Object} LatestVersion version data/ Latest version not found response
* @apiSuccessExample Response : 
* {
*   status: 200,
*   message: 'Latest version not found'
* }
*/
let getLatestVersion = (req, res) => {
  async.waterfall([
    (next) => {
      appVersionDbo.listAllVersions('m',
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
* @apiError ErrorWhileGettingVersions Error while gettng versions.
* @apiErrorExample ErrorWhileGettingVersions-Response:
* {
*   status: 500,
*   message: 'Error while getting versions'
* }
* @apiSuccess {Object} All versions data
* @apiSuccessExample Response : 
* {
*   status: 200,
*   list: Array of all version objects
* }
*/
let listAllVersions = (req, res) => {
  async.waterfall([
    (next) => {
      appVersionDbo.listAllVersions('m',
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
* @apiError ErrorWhileGettingUpdatedVersions Error while gettng updated versions.
* @apiErrorExample ErrorWhileGettingUpdatedVersions-Response:
* {
*   status: 500,
*   message: 'Error while getting updated versions'
* }
* @apiSuccess {Object} AllVersionsData
* @apiSuccessExample Response : 
* {
*   status: 200,
*   list: Array of all updated version objects.
* }
*/
let getUpdatedVersions = (req, res) => {
  let version = req.query['version'];
  let type = req.query['type'];
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