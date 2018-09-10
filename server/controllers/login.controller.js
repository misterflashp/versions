let async = require('async');
let loginDbo = require('../dbos/login.dbo');
var jwt = require('./JWToken');

let login = (req, res) => {
  let {
    name,
    password
  } = req.query;
  async.waterfall([
    (next) => {
      loginDbo.login({
        name,
        password
      }, (error, result) => {
        if (error) next({
          status: 500,
          message: 'error while logging in'
        }, null);
        else {
          if (result.length) {
            let out = {};
            jwt.issueToken(result, exp = null, function (err, token) {
              out['token'] = token;
            });
            next(null, {
              status: 200,
              details: result[0],
              token: out
            });
          } else {
            next({
              status: 400,
              message: 'invalid login credentials'
            }, null);
          }
        }
      });
    }
  ], (error, result) => {
    let response = Object.assign({
      success: !error
    }, error || result);
    let status = response.status;
    delete(response.status);
    res.status(status).send(response);
  });
}

let signUp = (req, res) => {
  let {
    email,
    password,
    name,
    lang
  } = req.body;
  async.waterfall([
    (next) => {
      loginDbo.signUp({
        email,
        password,
        name,
        lang
      }, (error, result) => {
        if (error) next({
          status: 500,
          message: 'error while signing up'
        }, null);
        else next(null, {
          status: 200,
          message: 'sign up successful'
        })
      });
    }
  ], (error, result) => {
    let response = Object.assign({
      success: !error
    }, error || result);
    let status = response.status;
    delete(response.status);
    res.status(status).send(response);
  });
}

module.exports = {
  login,
  signUp,

};