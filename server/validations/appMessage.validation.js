let joi = require('joi');

let updateMessage = (req, res, next) => {
  let updateMessageSchema = joi.object().keys({
    message: joi.string().required(),
    updatedMessage: joi.string().required(),
    updatedOn: joi.date()
  });
  let { error } = joi.validate(req.body, updateMessageSchema);
  if (error) res.status(422).send({
    success: false,
    error
  });
  else next();
};

let addMessage = (req, res, next) => {
  let addMessageSchema = joi.object().keys({
    message: joi.string(),
    updatedOn: joi.date()
  });
  let { error } = joi.validate(req.body, addMessageSchema);
  if (error) res.status(422).send({
    success: false,
    error
  });
  else next();
};

module.exports = {
  addMessage,
  updateMessage
};