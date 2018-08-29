let async = require('async');
let languageDbo = require('../dbos/language.dbo');
let updateMessage = (req, res) => {
  let { message,
    name } = req.body;
  async.waterfall([
    (next) => {
      languageDbo.updateMessage({ name, message },
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

let getMessage = (req, res) => {
  //   let { sortBy } = req.query;
  //   sortBy = (sortBy)? ((sortBy==="name")?sortBy:"message."+sortBy):"name";
  //   console.log(sortBy);
  async.waterfall([
    (next) => {
      languageDbo.getMessage((error, result) => {
        if (error) {
          next({
            status: 500,
            message: 'Error while fetching message'
          }, null);
        } else next(null, {
          status: 200,
          messages: result
        });
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

module.exports = {
  getMessage,
  updateMessage
};