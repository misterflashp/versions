let mongoose = require('mongoose');


let appSchema = new mongoose.Schema({
  version: {
    type: String,
    required: true
  },
  fileName: {
    type: String
  },
  fileUrl: {
    type: String,
    unique: true
  },
  type: {
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
