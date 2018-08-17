let async = require('async');
let appMessageDbo = require('../dbos/appMessage.dbo');
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
      appMessageDbo.addMessage(message, updatedOn,
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
      appMessageDbo.updateMessage(message, updatedMessage, updatedOn,
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
      appMessageDbo.getMessage((error, response) => {
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
  getMessage,
  updateMessage,
  addMessage
};