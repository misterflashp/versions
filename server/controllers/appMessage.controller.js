let async = require('async');
let appMessageDbo = require('../dbos/appMessage.dbo');
let logsDbo = require('../dbos/logs.dbo');
let jwt = require('../helpers/JWT');
let lodash = require('lodash');
var file = '/tmp/data.xml';
let fs = require('fs');

let updateMessage = (req, res) => {
  let { token } = req.headers;
  let { message,
    name, appCode, type } = req.body;
  let isActive = (type && type == 'delete') ? false : true;
  let updatedOn = Date.now();
  let oldMessage = {};
  async.waterfall([
    (next) => {
      jwt.verifyJWT(token, (error, data) => {
        if (error) next({
          status: 400,
          message: "Token expired"
        }, null);
        else {
          next(null, data);
        }
      });
    }, (data, next) => {
      appMessageDbo.getOneMessage({ name, appCode }, (error, message) => {
        if (error) {
          next({
            status: 500,
            message: 'Error while getting message'
          }, null);
        } else if (message && message.length) {
          oldMessage = message[0]['message'];
          next(null, data);
        } else {
          next(null, data);
        }
      })
    }, (data, next) => {
      let logObj = {
        user: data.name,
        appCode: appCode,
        messageName: name,
        oldMessage: oldMessage,
        newMessage: message,
        isActive: isActive,
        updatedOn: updatedOn
      }
      logsDbo.logRequest(logObj, (error, response) => {
        if (error) {
          next({
            status: 500,
            message: "Error while logging"
          }, null);
        } else {
          next(null);
        }
      });
    },
    (next) => {
      appMessageDbo.updateMessage({ message, appCode, name, updatedOn, isActive },
        (error, response) => {
          if (error) {
            next({
              status: 500,
              message: 'Error while updating message'
            }, null);
          } else next(null, {
            status: 200,
            message: (isActive) ? 'Updated successfully' : 'Deleted Successfully',
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

// let updateMessage = (req, res) => {
//   let { message,
//     name, appCode } = req.body;
//   let updatedOn = Date.now();
//   async.waterfall([
//     (next) => {
//       appMessageDbo.updateMessage({ message, appCode, name, updatedOn },
//         (error, response) => {
//           if (error) {
//             next({
//               status: 500,
//               message: 'Error while updating message'
//             }, null);
//           } else next(null, {
//             status: 200,
//             message: 'Updated successfully',
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
  let isActive = true;
  async.waterfall([
    (next) => {
      appMessageDbo.getMessage({ appCode, isActive, sortBy, ord }, (error, result) => {
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
  let { appCode, languages } = req.query;
  let isActive = true;
  // let language = languages[0];
  console.log(languages);
  let availableLang = [];
  let notAvailableLang = [];
  fs.writeFile(file, '');
  async.waterfall([
    (next) => {
      appMessageDbo.getOneMessage({ appCode, isActive }, (error, result) => {
        if (error) {
          next({
            status: 500,
            message: 'Error while fetching message'
          }, null);
        } else if (result && result.length) {
          let msg = result[0].message;
          let resource = `<resources>\n`;
          fs.appendFileSync(file, resource);
          lodash.forEach(languages, (language) => {
            if (msg.hasOwnProperty(language)) {
              resource = `<lang  name = \"${language}\"> \n`;
              fs.appendFileSync(file, resource);
              lodash.forEach(result, (obj) => {
                let string = "\t<string name = \"" + obj.name + "\"> " + obj.message[language] + "</string>\n";
                fs.appendFileSync(file, string);
              });
              let resourceend = "</lang>\n";
              fs.appendFileSync(file, resourceend);
              availableLang.push(language);
            } else {
              notAvailableLang.push(language);
            }
          });
          let resourceend = "</resources>";
          fs.appendFileSync(file, resourceend);
          next(null);
        } else {
          next({
            status: 400,
            message: ' No records found'
          }, null);
        }
      });
    },(next)=>{
      if(availableLang.length == languages.length){
        next(null,{
          status:200,
          message:'All languages available'
        });
      }else if(notAvailableLang.length == languages.length){
        next({
          status: 400,
          message: 'No language transalation available'
        });
      }else{
        next(null,{
          status:300,
          message: 'Some language transalation available'
        });
      }
    }], (error, result) => {
      let response = Object.assign({
        success: !error
      }, error || result);
      let status = response.status;
      delete (response.status);
      if (status == 200) {
        res.status(status).download(file, `${appCode}_All_Languages_Messages.xml`);
      }else if (status == 300) {
        res.status(200).download(file, `${appCode}_Some_Languages_Messages.xml`);
      } else {
        res.status(status).send(response);
      }
    });
}
// let getMessageFile = (req, res) => {
//   let { appCode, languages } = req.query;
//   let isActive = true;
//   let language = languages[0];
//   console.log(languages);
//   fs.writeFile(file, '');
//   async.waterfall([
//     (next) => {
//       appMessageDbo.getOneMessage({ appCode, isActive }, (error, result) => {
//         if (error) {
//           next({
//             status: 500,
//             message: 'Error while fetching message'
//           }, null);
//         } else if (result && result.length) {
//           let msg = result[0].message;
//           if (msg.hasOwnProperty(language)) {

//             let resource = `<resources>\n <lang  name = \"${language}\"> \n`;
//             fs.appendFileSync(file, resource);
//             lodash.forEach(result, (obj) => {
//               let string = "\t<string name = \"" + obj.name + "\"> " + obj.message[language] + "</string>\n";
//               fs.appendFileSync(file, string);
//             });
//             let resourceend = "</lang>\n</resources>";
//             fs.appendFileSync(file, resourceend);
//             next(null, {
//               status: 200,
//               messages: "Download the file"
//             });
//           } else {
//             next({
//               status: 400,
//               message: 'Requested language transalation is not available'
//             }, null);
//           }
//         } else {
//           next({
//             status: 400,
//             message: ' No records found'
//           }, null);
//         }
//       });
//     }], (error, result) => {
//       let response = Object.assign({
//         success: !error
//       }, error || result);
//       let status = response.status;
//       delete (response.status);
//       if (status == 200) {
//         res.status(status).download(file, `${appCode}_${language}_Messages.xml`);
//       } else {
//         res.status(status).send(response);
//       }
//     });
// }
let getLogs = (req, res) => {
  let { appCode,
    user,
    messageName } = req.query;
  let logObj = {}
  if (appCode) logObj.appCode = appCode;
  if (user) logObj.user = user;
  if (messageName) logObj.messageName = messageName;
  async.waterfall([
    (next) => {
      logsDbo.getLogs(logObj, (error, result) => {
        if (error) {
          next({
            status: 500,
            message: 'Error while fetching logs'
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
  searchMessage,
  getMessageFile,
  getLogs
};
     /* let resource = "<resources>\n <lang  name = \"english\"> \n";
          fs.appendFileSync(file, resource);
          lodash.forEach(result, (obj) => {
            let string = "\t<string name = \"" + obj.name + "\"> " + obj.message.english + "</string>\n";
            fs.appendFileSync(file, string);
          });
          fs.appendFileSync(file, "</lang>\n\n<lang name = \"russian\">\n");
          lodash.forEach(result, (obj) => {
            let string = "\t<string name = \"" + obj.name + "\"> " + obj.message.russian + "</string>\n";
            fs.appendFileSync(file, string);
          });
          // if (result[0].appCode == "SNC" || result[0].appCode == "SENTINEL") {
          fs.appendFileSync(file, "</lang>\n\n<lang name = \"spanish\">\n");
          lodash.forEach(result, (obj) => {
            let string = "\t<string name = \"" + obj.name + "\"> " + obj.message.spanish + "</string>\n";
            fs.appendFileSync(file, string);
          });
          // }
          if ((result[0].appCode) && ((result[0].appCode) == "SENTINEL")) {
            fs.appendFileSync(file, "</lang>\n\n<lang name = \"chinese\">\n");
            lodash.forEach(result, (obj) => {
              let string = "\t<string name = \"" + obj.name + "\"> " + obj.message.chinese + "</string>\n";
              fs.appendFileSync(file, string);
            });
          }
          if ((result[0].appCode) && (((result[0].appCode) == "SENTINEL") || ((result[0].appCode) == "DESKTOP_APP"))) {
            fs.appendFileSync(file, "</lang>\n\n<lang name = \"japanese\">\n");
            lodash.forEach(result, (obj) => {
              let string = "\t<string name = \"" + obj.name + "\"> " + obj.message.japanese + "</string>\n";
              fs.appendFileSync(file, string);
            });
          }

          let resourceend = "</lang>\n</resources>";
          fs.appendFileSync(file, resourceend);
          */
