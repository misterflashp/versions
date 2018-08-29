let mongoose = require('mongoose');

let languageSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  message: {
    type: Object
  }
}, {
    versionKey: false,
    strict: true
  });
module.exports = mongoose.model('languages', languageSchema);