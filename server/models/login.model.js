let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  lang: {
    type: Array
  }
}, {
  versionKey: false,
  strict: true
});

module.exports = mongoose.model('user', userSchema);