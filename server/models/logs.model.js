let mongoose = require('mongoose');

let logSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  appCode: {
    type: String,
    required: true
  },
  modifiedIn: {
    type: String,
    required: true
  },
  newObject: {
    type: Object,
    required: true
  },
  updatedOn: {
    type: Date,
    required: true
  }
}, {
    versionKey: false,
    strict: true
  });

module.exports = mongoose.model('log', logSchema);