let async = require('async');
let userDbo = require('../dbos/user.dbo');
var jwt = require('../helpers/JWT');

let login = (req, res) => {
  let {
    username,
    password
  } = req.query;
  async.waterfall([
    (next) => {
      userDbo.login({
        username,
        password
      }, (error, result) => {
        if (error) next({
          status: 500,
          message: 'Error while logging in'
        }, null);
        else {
          if (result.length) {
            let out = {};
            jwt.issueToken(result, (error, token) => {
              if (error) next({
                status: 500,
                message: ' Error occured while creating JWT'
              }, null);
              else {
                out['token'] = token;
                next(null, {
                  status: 200,
                  details: result[0],
                  token: out
                });
              }
            });
          } else {
            next({
              status: 400,
              message: 'Invalid login credentials'
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
    delete (response.status);
    res.status(status).send(response);
  });
}

let signUp = (req, res) => {
  let {
    email,
    password,
    username,
    name
  } = req.body;
  async.waterfall([
    (next) => {
      userDbo.getUserDetails({username},(error, result)=>{
        if(error) next({
          status:500,
          message: 'Error occured while checking username'
        },null);
        else if(result && result.length){
          next({
          status: 400,
          message: "User already exists"           
          }, null);
        }
        else{
          next(null);
        }
      });
    },
    (next)=>{
      userDbo.signUp({
        email,
        password,
        name,
        username
      }, (error, result) => {
        if (error) next({
          status: 500,
          message: 'Error while signing up'
        }, null);
        else next(null, {
          status: 200,
          message: 'Sign Up successful'
        })
      });
    }
  ], (error, result) => {
    let response = Object.assign({
      success: !error
    }, error || result);
    let status = response.status;
    delete (response.status);
    res.status(status).send(response);
  });
}

module.exports = {
  login,
  signUp,

};