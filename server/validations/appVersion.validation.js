let joi = require('joi');


let addAppDetails = (req, res, next) => {
  let versionSchema = joi.object().keys({
    version: joi.number().required(),
    fileUrl: joi.string().required(),
    appCode: joi.string().required()
  });
  let { error } = joi.validate(req.body, versionSchema);
  if (error) res.status(400).send({
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
  if (error) res.status(400).send({
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
  if (error) res.status(400).send({
    success: false,
    error
  });
  else next();
};

let getUpdatedVersions = (req, res, next) => {
  let updatedVersionsSchema = joi.object().keys({
    version: joi.number().required(),
    appCode: joi.string().required()
  });
  let { error } = joi.validate(req.query, updatedVersionsSchema);
  if (error) res.status(400).send({
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