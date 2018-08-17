let appMessageController = require('../controllers/appMessage.controller');
let appMessageValidation = require('../validations/appMessage.validation');

module.exports = (server) => {
    server.get('/message', appMessageController.getMessage);
    server.put('/message', appMessageValidation.updateMessage, appMessageController.updateMessage);
    server.post('/message', appMessageValidation.addMessage, appMessageController.addMessage);
};