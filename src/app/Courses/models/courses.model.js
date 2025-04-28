const { model, Schema } = require("mongoose");

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    thumbnail: {
      type: String,
    },

    category: {
      type: String,
    },

    language: {
      type: String,
    },

    instructorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
const courseModel = model("Course", courseSchema);
module.exports = courseModel;
