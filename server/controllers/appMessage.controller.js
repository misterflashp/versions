let async = require('async');
let appMessageDbo = require('../dbos/appMessage.dbo');
let logsDbo = require('../dbos/logs.dbo');
let jwt = require('../helpers/JWT');
let lodash = require('lodash');
var file = '/tmp/data.xml';
let fs = require('fs');

let updateMessage = (req, res) => {
  let { token } = req.headers;
  let { value,
    name, appCode, type, version } = req.body;
  let isActive = (type && type == 'delete') ? false : true;
  let updatedOn = Date.now();
  let oldValue = {};
  let status = null;
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
          oldValue = message[0]['values'];
          status = (type && type == 'approve') ? 'approved' : message[0]['status'];
          //console.log(status);
          next(null, data);
        } else {
          status = 'pending';
          next(null, data);
        }
      })
    }, (data, next) => {
      oldValue[version] = value;
      if (!isActive) delete oldValue[version];
      isActive = true;
      //console.log(status);
      let messageObj = {
        values: oldValue,
        name: name,
        isActive: isActive,
        updatedOn: updatedOn,
        appCode: appCode,
        status: status
      }
      let logObj = {
        username: data.username,
        appCode: appCode,
        newObject: {
          name: messageObj.name,
          status: messageObj.status,
          isActive: messageObj.isActive,
          value: value,
          version: version
        },
        modifiedIn: "message",
        updatedOn: updatedOn
      }
      logsDbo.logRequest(logObj, (error, response) => {
        if (error) {
          next({
            status: 500,
            message: "Error while logging"
          }, null);
        } else {
          next(null, messageObj);
        }
      });
    },
    (messageObj, next) => {
      appMessageDbo.updateMessage(messageObj,
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

let getMessage = (req, res) => {
  let { appCode,
    sortBy,
    order, version } = req.query;
  sortBy = (sortBy) ? ((sortBy === "name") ? sortBy : "message." + sortBy) : "name";
  let ord = (order) ? ((order === 'desc') ? "desc" : "asc") : "asc";
  let isActive = true;
  async.waterfall([
    (next) => {
      appMessageDbo.getOneMessage({ appCode, isActive }, (error, result) => {
        if (error) {
          next({
            status: 500,
            message: 'Error while fetching message'
          }, null);
        } else next(null, result);
      });
    }, (result, next) => {
      let final = [];
      lodash.forEach(result, (res) => {
        if ((res.values).hasOwnProperty(version)) {
          let obj = Object.assign({
            "appCode": res.appCode,
            "name": res.name,
            "updatedOn": res.updatedOn,
            "message": res.values[version],
            "status": res.status,
            "versions": Object.keys(res.values)
          });
          final.push(obj);
        }
      });
      let final2 = lodash.orderBy(final, sortBy, ord);
      next(null, {
        status: 200,
        result: final2
      })
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
    appCode,
    version } = req.query;
  searchKey = searchKey.toLowerCase();
  async.waterfall([
    (next) => {
      appMessageDbo.searchMessageNew({ appCode },
        (error, result) => {
          if (error) next({
            status: 500,
            message: 'Error while searching '
          }, null);
          else if (result && result.length) {
            let searched = [];
            lodash.forEach(result, (res) => {
              if ((res.values).hasOwnProperty(version)) {
                let msg = res.values[version];
                if ((res.name) && (res.name).toLowerCase().indexOf(searchKey) > -1 ||
                  (msg.english) && (msg.english).toLowerCase().indexOf(searchKey) > -1 ||
                  (msg.spanish) && (msg.spanish).toLowerCase().indexOf(searchKey) > -1 ||
                  (msg.russian) && (msg.russian).toLowerCase().indexOf(searchKey) > -1 ||
                  (msg.chinese) && (msg.chinese).toLowerCase().indexOf(searchKey) > -1 ||
                  (msg.turkish) && (msg.turkish).toLowerCase().indexOf(searchKey) > -1 ||
                  (msg.japanese) && (msg.japanese).toLowerCase().indexOf(searchKey) > -1) {
                  let obj = Object.assign({
                    name: res.name,
                    appCode: res.appCode,
                    message: msg,
                    updatedOn: res.updatedOn
                  });
                  searched.push(obj);
                }
              }
            });
            if (searched.length) next(null, {
              status: 200,
              success: true,
              info: searched
            });
            else next({
              status: 400,
              message: "No records found"
            }, null);
          }
          else {
            next({
              status: 400,
              message: "No records found"
            }, null);
          }
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
  let { appCode, languages, version } = req.query;
  let isActive = true;
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
          let final = [];
          let allLang = []
          lodash.forEach(result, (res) => {
            if ((res.values).hasOwnProperty(version)) {
              let obj = Object.assign({
                "appCode": res.appCode,
                "name": res.name,
                "message": res.values[version]
              });
              final.push(obj);
              let lang = Object.keys(res.values[version]);
              allLang = allLang.concat(lang);
            }
          });
          allLang = lodash.uniq(allLang);
          let resource = `<resources>\n`;
          fs.appendFileSync(file, resource);
          lodash.forEach(languages, (language) => {
            if (allLang.indexOf(language) > -1) {
              resource = `<lang  name = \"${language}\"> \n`;
              fs.appendFileSync(file, resource);
              lodash.forEach(final, (obj) => {
                let string = "\t<string name = \"" + obj.name + "\"> " + obj.message[language] + "</string>\n";
                if (obj.message[language]) fs.appendFileSync(file, string);
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
    }, (next) => {
      if (availableLang.length == languages.length) {
        next(null, {
          status: 200,
          message: 'All languages available'
        });
      } else if (notAvailableLang.length == languages.length) {
        next({
          status: 400,
          message: 'No language transalation available'
        });
      } else {
        next(null, {
          status: 300,
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
        res.status(status).download(file, `${appCode}_${version}_All_Languages_Messages.xml`);
      } else if (status == 300) {
        res.status(200).download(file, `${appCode}_${version}_Some_Languages_Messages.xml`);
      } else {
        res.status(status).send(response);
      }
    });
}

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
