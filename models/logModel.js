const mongoose = require('mongoose');

const logModel = mongoose.Schema(
  {
    rawHeaders: {
        type: Array,
        required: true,
    },
    httpVersion: {
        type: String,
        required: true
    },
    method: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true
    }
  },
  {
    timestamps: true
  }
)

const Log = mongoose.model('Log', logModel)

module.exports = Log