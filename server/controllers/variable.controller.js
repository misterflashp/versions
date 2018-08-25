let async = require('async');
let variableDbo = require('../dbos/variable.dbo');
/**
* @api {post} /variable To add a message.
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


let addVariable = (req, res) => {
  let { name,
  value } = req.body;
  let updatedOn = Date.now();
  async.waterfall([
    (next) => {
        variableDbo.addVariable({ name, value, updatedOn },(error, result)=>{
            if(error) next({
                status:500,
                message: 'error while saving'
            },null);
            else{
                next(null,{
                    status:200,
                    message:'added successfully'
                });
            }
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

// let addMessage = (req, res) => {
//   let { message,
//   appCode } = req.body;
//   let updatedOn = Date.now();
//   async.waterfall([
//     (next) => {
//       messageDbo.addMessage({ message, updatedOn, appCode },
//         (error, result) => {
//           if (error) {
//             next({
//               status: 500,
//               message: 'Error while saving message'
//             }, null);
//           } else next(null, {
//             status: 200,
//             info: result
//           });
//         });
//     }], (error, result) => {
//       let response = Object.assign({
//         success: !error
//       }, error || result);
//       let status = response.status;
//       delete (response.status);
//       res.status(status).send(response);
//     });
// }
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
let updateVariable = (req, res) => {
  let { name,
    value } = req.body;
  let updatedOn = Date.now();
  async.waterfall([
    (next) => {
        variableDbo.updateVariable({ name, value, updatedOn }, (error,result)=>{
            if(error) next({
                status:500,
                message: 'Error occured while updatating data'
            },null);
            else next(null,{
                status:200,
                message: 'updated successfully'
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
let getVariable = (req, res) => {
//   let { 
//       name } = req.query;
  async.waterfall([
      (next) => {
        variableDbo.getVariable((error,result)=>{
            if(error) next({
                status:500,
                message: 'Error while fetching variables'
            },null);
            else next(null,{
                status:200,
                info: result
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
  addVariable,
  updateVariable,
  getVariable
};