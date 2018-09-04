let loginController = require('../controllers/login.controller');
let loginValidation = require('../validations/login.validation');

module.exports = (server) => {
    server.get('/login', loginValidation.login, loginController.login);
    server.post('/signUp', loginValidation.signUp, loginController.signUp);
};