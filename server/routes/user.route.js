let userController = require('../controllers/user.controller');
let userValidation = require('../validations/user.validation');

module.exports = (server) => {
    server.get('/login', userValidation.login, userController.login);
    server.post('/signUp', userValidation.signUp, userController.signUp);
};