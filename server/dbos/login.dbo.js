let LoginModel = require('../models/login.model');

let login = (obj, cb) => {
  LoginModel.find(obj, {}, (error, result) => {
    if (error) cb(error, null);
    else cb(null, result || []);
  })
}

let signUp = (obj, cb) => {
  let object = new LoginModel(obj);
  object.save((error, result) => {
    if (error) cb(error, null);
    else cb(null, result || []);
  })
}

module.exports = {
  login,
  signUp
};