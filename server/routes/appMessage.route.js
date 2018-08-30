let appMessageController = require('../controllers/appMessage.controller');
let appMessageValidation = require('../validations/appMessage.validation');

module.exports = (server) => {
    server.get('/message', appMessageValidation.getMessage, appMessageController.getMessage);
    server.put('/message', appMessageValidation.updateMessage, appMessageController.updateMessage);
    server.post('/message', appMessageValidation.updateMessage, appMessageController.updateMessage);
    server.get('/message/search', appMessageValidation.searchMessage, appMessageController.searchMessage);
};