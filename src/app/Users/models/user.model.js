const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },

  enrolledCourseIds: [
    {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
  ],

  source: {
    type: String,
    enum: ["otp", "razorpay", "upi"],
  },
});

const userModel = model("User", userSchema);
module.exports = userModel;