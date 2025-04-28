const { model, Schema } = require("mongoose");

const moduleSchema = new Schema(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    lectureIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lecture",
      },
    ],

    order: {
      type: Number,
    },

    
  },
  { timestamps: true }
);

const moduleModel = model("Module", moduleSchema);
module.exports = moduleModel;
