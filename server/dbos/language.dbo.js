let LanguageModel = require('../models/language.model');

let getMessage = (cb) => {
  LanguageModel.find({}, {
    '_id': 0
  }, (error, result) => {
    if (error) cb(error, null);
    else cb(null, result || []);
  });
};


let updateMessage = (obj, cb) => {
  let { name } = obj;
  LanguageModel.updateOne({
    name
  }, {
      $set: obj
    }, {
      upsert: true
    }, (error, result) => {
      console.log(result);
      if (error) cb(error, null);
      else cb(null, result || []);
    });
}

module.exports = {
  getMessage,
  updateMessage
};