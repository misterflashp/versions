let AppModel = require('../models/appVersion.model');
let MessageModel = require('../models/message.model');

let getAppDetails = (version, appCode, cb) => {
  AppModel.findOne({
    version,
    appCode
  }, {
      '_id': 0
    }, (error, result) => {
      if (error) cb(error, null);
      cb(null, result || null);
    });
};

let addAppDetails = (appDetails, cb) => {
  let app = new AppModel(appDetails);
  app.save((error, result) => {
    if (error) cb(error, null);
    cb(null, result);
  });
};

let listAllVersions = (appCode, cb) => {
  AppModel.find({
    appCode
  }, {
      '_id': 0
    }, {
      sort: {
        'version': -1
      }
    }, (error, result) => {
      //console.log(error, result);
      if (error) cb(error, null);
      else cb(null, result || []);
    });
};

let getUpdatedVersions = (version, appCode, cb) => {
  AppModel.find({
    appCode,
    'version': {
      $gt: version
    }
  }, {
      '_id': 0
    }, {
      sort: {
        'version': -1
      }
    }, (error, result) => {
      if (error) cb(error, null);
      else cb(null, result || []);
    });
};

let getMessage = (cb) => {
  MessageModel.find({}, {
    '_id': 0
  }, {
      sort: {
        'updatedOn': -1
      }
    }, (error, result) => {
      if (error) cb(error, null);
      else cb(null, result || []);
    });
};

let addMessage = (message, updatedOn, cb) => {
  let obj = {
    'message': message,
    'updatedOn': updatedOn
  }
  let newMessage = new MessageModel(obj);
  newMessage.save((error, result) => {
    if (error) cb(error, null);
    cb(null, result);
  });
};

let updateMessage = (message, updatedMessage, updatedOn, cb) => {
  MessageModel.findOneAndUpdate({
    message
  }, {
      $set: { 'message': updatedMessage, 'updatedOn': updatedOn }
    }, (error, result) => {
      if (error) cb(error, null);
      else cb(null, result || []);
    });
};
module.exports = {
  getAppDetails,
  addAppDetails,
  listAllVersions,
  getUpdatedVersions,
  getMessage,
  updateMessage,
  addMessage
};