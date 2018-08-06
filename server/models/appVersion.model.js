let mongoose = require('mongoose');


let appSchema = new mongoose.Schema({
  version: {
    type: Number,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  appCode: {
    type: String,
    required: true
  },
  createdOn: {
    type: Date,
    default: Date.now
  },
  checksum: {
    type: String,
    default: null
  }
}, {
    versionKey: false,
    strict: true
  });

module.exports = mongoose.model('App', appSchema);