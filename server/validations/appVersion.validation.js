let joi = require('joi');


let addAppDetails = (req, res, next) => {
  let versionSchema = joi.object().keys({
    version: joi.string().required(),
    fileLink: joi.string().required(),
    appCode: joi.string().required(),
    appName: joi.string().required()
  });
  let { error } = joi.validate(req.body, versionSchema);
  if (error) res.status(422).send({
    success: false,
    error
  });
  else next();
};

let getLatestVersion = (req, res, next) => {
  let updatedVersionsSchema = joi.object().keys({
    appCode: joi.string().required()
  });
  let { error } = joi.validate(req.query, updatedVersionsSchema);
  if (error) res.status(422).send({
    success: false,
    error
  });
  else next();
};

let listAllVersions = (req, res, next) => {
  let updatedVersionsSchema = joi.object().keys({
    appCode: joi.string().required()
  });
  let { error } = joi.validate(req.query, updatedVersionsSchema);
  if (error) res.status(422).send({
    success: false,
    error
  });
  else next();
};

let getUpdatedVersions = (req, res, next) => {
  let updatedVersionsSchema = joi.object().keys({
    version: joi.string().required(),
    appCode: joi.string().required()
  });
  let { error } = joi.validate(req.query, updatedVersionsSchema);
  if (error) res.status(422).send({
    success: false,
    error
  });
  else next();
};

module.exports = {
  addAppDetails,
  getUpdatedVersions,
  getLatestVersion,
  listAllVersions,
};