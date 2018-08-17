let MessageModel = require('../models/appMessage.model');

let getMessage = (cb) => {
    MessageModel.find({}, {
        '_id': 0
    }, {
            sort: {
                'updatedOn': -1
            }
        }, (error, result) => {
            if (error) cb(error, null);
            else cb(null, result || []);
        });
};

let addMessage = (message, updatedOn, cb) => {
    let obj = {
        'message': message,
        'updatedOn': updatedOn
    }
    let newMessage = new MessageModel(obj);
    newMessage.save((error, result) => {
        if (error) cb(error, null);
        cb(null, result);
    });
};

let updateMessage = (message, updatedMessage, updatedOn, cb) => {
    MessageModel.findOneAndUpdate({
        message
    }, {
            $set: { 'message': updatedMessage, 'updatedOn': updatedOn }
        }, (error, result) => {
            if (error) cb(error, null);
            else cb(null, result || []);
        });
};
module.exports = {
    getMessage,
    updateMessage,
    addMessage
};