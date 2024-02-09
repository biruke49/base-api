const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const activityLoggerSchema = new Schema(
  {
    model: {
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
    operation: {
      type: String,
      required: true,
    },
    old: {
      type: Schema.Types.Mixed,
      required: false,
    },
    payload: {
      type: Schema.Types.Mixed,
      required: true,
    },
    author: {
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone_number: {
        type: String,
        required: true,
      },
      role: {
        type: Array,
        required: false,
      },
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("ActivityLogger", activityLoggerSchema);
