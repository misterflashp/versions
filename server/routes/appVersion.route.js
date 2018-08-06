let appVersionController = require('../controllers/appVersion.controller');
let appVersionValidation = require('../validations/appVersion.validation');


module.exports = (server) => {
    server.post('/version', appVersionValidation.addAppDetails, appVersionController.addAppDetails);
    server.get('/version/latest', appVersionValidation.getLatestVersion, appVersionController.getLatestVersion);
    server.get('/version/list', appVersionValidation.listAllVersions, appVersionController.listAllVersions);
    server.get('/version/updated', appVersionValidation.getUpdatedVersions, appVersionController.getUpdatedVersions);
};