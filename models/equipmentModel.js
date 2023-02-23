const mongoose = require('mongoose');
const { Schema } = mongoose;

const equipmentModel = new Schema(
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
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    }
  },
  {
    timestamps: true,
  }
)

const Equipment = mongoose.model('Equipment', equipmentModel)

module.exports = Equipment