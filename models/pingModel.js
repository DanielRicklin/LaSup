const mongoose = require('mongoose');

const pingModel = mongoose.Schema(
  {
    equipment: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Equipment',
    },
    ip: {
      type: String,
      required: true,
    },
    alive: {
      type: Boolean,
    },
    latency: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
)

// pingModel.methods.findEquipmentId = function 

const Ping = mongoose.model('Ping', pingModel)

module.exports = Ping