const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passwordResetTokenSchema = new Schema({
  token: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    match: [/\S+@\S+\.\S+/, "is invalid"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600,
  },
  user_id: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("PasswordResetToken", passwordResetTokenSchema);
