let MessageModel = require('../models/appMessage.model');

let searchMessage = (obj, cb) => {
  let searchKey = obj.searchKey;
  let appCode = obj.appCode;
  MessageModel.find({
    "$or": [
      { 'name': { $regex: searchKey, $options: "i" } },
      { 'message.english': { $regex: searchKey, $options: "i" } },
      { 'message.spanish': { $regex: searchKey, $options: "i" } },
      { 'message.japanese': { $regex: searchKey, $options: "i" } },
      { 'message.chinese': { $regex: searchKey, $options: "i" } },
      { 'message.russian': { $regex: searchKey, $options: "i" } },
      { appCode: { $regex: searchKey, $options: "i" } },
    ],
    appCode
  }, (error, result) => {
    if (error) cb(error, null);
    else cb(null, result || []);
  });
}


let getMessage = (obj, cb) => {
  // console.log(obj);
  let searchObj = `values.${obj.version}`;
  let { appCode, sortBy, ord, isActive, version } = obj;
  let sortObj = {};
  sortObj[sortBy] = ord;
  MessageModel.find({
    appCode,
    values: { $exists: true },
    isActive
  }, {}, {
      sort: sortObj
    }, (error, result) => {
      if (error) cb(error, null);
      else cb(null, result || []);
    });
};

let updateMessage = (obj, cb) => {
  let { appCode, name } = obj;
  MessageModel.updateOne({
    name, appCode
  }, {
      $set: obj
    }, {
      upsert: true
    }, (error, result) => {
      if (error) cb(error, null);
      else cb(null, result || []);
    });
}

let getOneMessage = (obj, cb) => {
  MessageModel.find(obj, {
    '_id': 0
  }, (error, result) => {
    if (error) cb(error, null);
    cb(null, result || null);
  });
};

module.exports = {
  getMessage,
  updateMessage,
  searchMessage,
  getOneMessage
};