let mongoose = require('mongoose');

let messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  values: {
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
  createdOn: {
    type: Date,
    required: true,
    default: Date.now()
  },
  status: {
    type: String,
    required: true,
    default: "pending"
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

module.exports = mongoose.model('message', messageSchema);