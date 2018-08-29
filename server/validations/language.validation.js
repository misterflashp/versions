let joi = require('joi');

let updateMessage = (req, res, next) => {
  let updateMessageSchema = joi.object().keys({
    message: joi.object().required(),
    name: joi.string().required()
    // appCode: joi.string().required()
  });
  let { error } = joi.validate(req.body, updateMessageSchema);
  if (error) res.status(422).send({
    success: false,
    error
  });
  else next();
};

module.exports = {
  updateMessage
};