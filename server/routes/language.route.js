let languageController = require('../controllers/language.controller');
let languageValidation = require('../validations/language.validation');

module.exports = (server) => {
  server.get('/language', languageController.getMessage);
  server.put('/language', languageValidation.updateMessage, languageController.updateMessage);
  server.post('/language', languageValidation.updateMessage, languageController.updateMessage);
};