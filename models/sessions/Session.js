const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const sessionSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    ip_address: {
      type: String,
      required: false,
    },
    user_agent: {
      type: String,
      required: false,
    },
    token: {
      type: String,
      required: true,
    },
    refresh_token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Session", sessionSchema);
