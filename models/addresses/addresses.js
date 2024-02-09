const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addressSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);
