let mongoose = require('mongoose');

let logSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    messageName: {
        type: String,
        required: true
    },
    oldMessage: {
        type: Object,
        required: true
    },
    newMessage: {
        type: Object,
        required: true
    },
    appCode: {
        type: String,
        required: true
    },
    updatedOn: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    }
}, {
        versionKey: false,
        strict: true
    });

module.exports = mongoose.model('log', logSchema);