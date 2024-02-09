const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var uniqueValidator = require("mongoose-unique-validator");
const userSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 25,
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 25,
    },
    email: {
      type: String,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "is invalid"],
      index: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female"],
    },
    phone_number: {
      type: String,
      required: true,
      unique: true,
      minlength: 10,
      maxlength: 13,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Array,
      required: true,
    },
    user_type: {
      type: String,
      required: false,
    },
    address: {
      city: {
        type: String,
        required: true,
      },
      sub_city: {
        type: String,
        required: false,
      },
      woreda: {
        type: String,
        required: true,
      },
      house_number: {
        type: String,
        required: true,
      },
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    profile_image: {
      type: String,
      required: false,
    },
    fcm_id: {
      type: String,
      required: false,
    },
    emergency_contact: {
      type: String,
      required: false,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: true }
);
userSchema.plugin(uniqueValidator, {
  message: "Error, expected {PATH} to be unique.",
});
module.exports = mongoose.model("User", userSchema);
