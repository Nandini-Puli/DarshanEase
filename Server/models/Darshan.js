const mongoose = require("mongoose");

const darshanSchema = new mongoose.Schema(
  {
    templeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Temple",
      required: true,
    },

    darshanName: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    date: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    availableSeats: {
      type: Number,
      required: true,
      min: 0,
    },

    bookedSeats: {
      type: Number,
      default: 0,
      min: 0,
    },

    price: {
      type: Number,
      required: true,
    },
    isActive:{
    type:Boolean,
    default:true
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Darshan", darshanSchema);
