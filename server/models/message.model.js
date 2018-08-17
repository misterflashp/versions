let mongoose = require('mongoose');

let messageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    updatedOn: {
        type: Date,
        required: Date.now
    }
}, {
        versionKey: false,
        strict: true
    });

module.exports = mongoose.model('Message', messageSchema);