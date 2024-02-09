const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const settingSchema = new Schema(
  {
    radius: {
      // truck: {
      //     type: Number,
      //     required: false,
      //     default: 200
      // },
      taxi: {
        type: Number,
        required: false,
        default: 200,
      },
    },
    award_point: {
      taxi: {
        type: Number,
        required: false,
      },
      // truck: {
      //     type: Number,
      //     required: false
      // }
    },
    // borrow_limit: {
    //     type: Number,
    //     default: 100
    // },
    last_updated_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Setting", settingSchema);
