let mongoose = require('mongoose');

let variableSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    value: {
        type: String,
    },
    updatedOn: {
        type: Date,
        required: true
    }
}, {
        versionKey: false,
        strict: true
    });
module.exports = mongoose.model('variable', variableSchema);