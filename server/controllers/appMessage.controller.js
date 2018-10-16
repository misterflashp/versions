let async = require('async');
let appMessageDbo = require('../dbos/appMessage.dbo');
let logsDbo = require('../dbos/logs.dbo');
let jwt = require('../helpers/JWT');
let lodash = require('lodash');
var file = '/tmp/data.xml';
let fs = require('fs');
/**
* @api {post/put} /message To update or add message.
* @apiName updateMessage
* @apiGroup Message
* @apiParam {Object} message Message to be updated.
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
  let { appCode,
    sortBy,
    order } = req.query;
  sortBy = (sortBy) ? ((sortBy === "name") ? sortBy : "message." + sortBy) : "name";
  let ord = (order) ? ((order === 'desc') ? -1 : 1) : 1;
  async.waterfall([
    (next) => {
      appMessageDbo.getMessage({ appCode, sortBy, ord }, (error, result) => {
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
let searchMessage = (req, res) => {
  let { searchKey,
    appCode } = req.query;
  async.waterfall([
    (next) => {
      appMessageDbo.searchMessage({ searchKey, appCode },
        (error, result) => {
          if (error) next({
            status: 500,
            message: 'Error while searching '
          }, null);
          else next(null, {
            status: 200,
            info: result
          });
        });
    }
  ], (error, success) => {
    let response = Object.assign({
      success: !error
    }, error || success);
    let status = response.status;
    delete (response.status);
    res.status(status).send(response);
  });
}
let getMessageFile = (req, res) => {
  let { appCode } = req.query;
  async.waterfall([
    (next) => {
      appMessageDbo.getOneMessage({ appCode }, (error, result) => {
        if (error) {
          next({
            status: 500,
            message: 'Error while fetching message'
          }, null);
        } else {
          let resource = "<resources>\n <lang  name = \"english\"> \n";
          fs.writeFile(file, '');
          fs.appendFileSync(file, resource);
          lodash.forEach(result, (obj) => {
            let string = "\t<strings name = \"" + obj.name + "\"> " + obj.message.english + "</strings>\n";
            fs.appendFileSync(file, string);
          });
          fs.appendFileSync(file, "/<lang>\n\n<lang name = \"russian\">\n");
          lodash.forEach(result, (obj) => {
            let string = "\t<strings name = \"" + obj.name + "\"> " + obj.message.russian + "</strings>\n";
            fs.appendFileSync(file, string);
          });
          // if (result[0].appCode == "SNC" || result[0].appCode == "SENTINEL") {
          fs.appendFileSync(file, "</lang>\n\n<lang name = \"spanish\">\n");
          lodash.forEach(result, (obj) => {
            let string = "\t<strings name = \"" + obj.name + "\"> " + obj.message.spanish + "</strings>\n";
            fs.appendFileSync(file, string);
          });
          // }
          if (result[0].appCode == "SENTINEL") {
            fs.appendFileSync(file, "</lang>\n\n<lang name = \"chinese\">\n");
            lodash.forEach(result, (obj) => {
              let string = "\t<strings name = \"" + obj.name + "\"> " + obj.message.chinese + "</strings>\n";
              fs.appendFileSync(file, string);
            });
            fs.appendFileSync(file, "</lang>\n\n<lang name = \"japanese\">\n");
            lodash.forEach(result, (obj) => {
              let string = "\t<strings name = \"" + obj.name + "\"> " + obj.message.japanese + "</strings>\n";
              fs.appendFileSync(file, string);
            });
          }

          let resourceend = "</lang>\n</resources>";
          fs.appendFileSync(file, resourceend);
          next(null, {
            status: 200,
            messages: "Download the file"
          });
        }
      });
    }], (error, result) => {
      let response = Object.assign({
        success: !error
      }, error || result);
      let status = response.status;
      delete (response.status);
      res.status(status).download(file, 'messages.xml');
    });
}

module.exports = {
  getMessage,
  updateMessage,
  searchMessage,
  getMessageFile
};