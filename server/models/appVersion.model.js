let mongoose = require('mongoose');

let appSchema = new mongoose.Schema({
  appCode: {
    type: String,
    required: true
  },
  appName: {
    type: String,
    required: true
  },
  version: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileLink: {
    type: String,
    required: true
  },
  createdOn: {
    type: Date,
    default: Date.now
  },
  fileChecksum: {
    type: String,
    default: null
  }
}, {
    versionKey: false,
    strict: true
  });

module.exports = mongoose.model('App', appSchema);