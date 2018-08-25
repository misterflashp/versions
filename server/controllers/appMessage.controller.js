let async = require('async');
let appMessageDbo = require('../dbos/appMessage.dbo');
/**
* @api {post} /message To add a message.
* @apiName addMessage
* @apiGroup Message
* @apiParam {String} message Message to be saved.
* @apiParam {String} appCode Type of app.
* @apiParam {String} name Message name.
* @apiError ErrorWhileAddingMessage Error while adding the message.
* @apiErrorExample ErrorWhileAddingMessage-Response:
* {
*   success: false,
*   message: 'Error while adding message'
* }
*@apiSuccessExample Response : 
* {
*   success: true,
*   message: "Added successfully"
* }
*/
let addMessage = (req, res) => {
  let { message,
    name,
      appCode } = req.body;
  let updatedOn = Date.now();
  async.waterfall([
    (next) => {
      appMessageDbo.updateMessage({ message, appCode, updatedOn, name },
        (error, result) => {
          if (error) {
            next({
              status: 500,
              message: 'Error while adding message'
            }, null);
          } else next(null, {
            status: 200,
            message: 'Added successfully'
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
* @apiParam {String} appCode Type of app.
* @apiParam {String} name Message name.
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
    name, appCode } = req.body;
  let updatedOn = Date.now();
  async.waterfall([
    (next) => {
      appMessageDbo.updateMessage({ message, appCode, name, updatedOn },
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
* @apiParam {String} appCode Type of app.
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
  let { appCode } = req.query;
  async.waterfall([
    (next) => {
      appMessageDbo.getMessage(appCode,(error, result) => {
        if (error) {
          next({
            status: 500,
            message: 'Error while fetching message'
          }, null);
        } else next(null, {
          status: 200,
          messages: result
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
  getMessage,
  updateMessage,
  addMessage
};