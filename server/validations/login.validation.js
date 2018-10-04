let joi = require('joi');

let login = (req, res, next) => {
    let loginSchema = joi.object().keys({
        name: joi.string().required(),
        password: joi.string().required()
    });
    let {
        error
    } = joi.validate(req.query, loginSchema);
    if (error) res.status(422).send({
        success: false,
        error
    });
    else next();
};
let signUp = (req, res, next) => {
    let signUpSchema = joi.object().keys({
        name: joi.string().required(),
        email: joi.string().required(),
        password: joi.string().required(),
        lang: joi.array()
    });
    let {
        error
    } = joi.validate(req.body, signUpSchema);
    if (error) res.status(422).send({
        success: false,
        error
    });
    else next();
};

module.exports = {
    login,
    signUp
};