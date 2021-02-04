const mongoose = require('mongoose');

const equipmentModel = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    ip: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

const Equipment = mongoose.model('Equipment', equipmentModel)

module.exports = Equipment