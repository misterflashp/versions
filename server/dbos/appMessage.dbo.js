let MessageModel = require('../models/appMessage.model');

let getMessage = (appCode, cb) => {
    MessageModel.find({ appCode }, {
        '_id': 0
    }, (error, result) => {
        if (error) cb(error, null);
        else cb(null, result || []);
    });
};


let updateMessage = (obj, cb) => {
    let { appCode, name } = obj;

    MessageModel.updateOne({
        name, appCode
    }, {
            $set: obj
        }, {
            upsert: true
        }, (error, result) => {
            console.log(result);
            if (error) cb(error, null);
            else cb(null, result || []);
        });
}

module.exports = {
    getMessage,
    updateMessage
};