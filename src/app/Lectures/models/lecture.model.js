const { model, Schema } = require("mongoose");

const lectureSchema = new Schema({
  moduleId: {
    type: Schema.Types.ObjectId,
    ref: "Module",
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  videoUrl: {
    type: String,
    required: true,
  },

  duration: {
    type: String,
    required: true,
  },

  resources: [
    {
      name: String,
      type: String,
      url: String,
    },
  ],
  order: {
    type: Number,
  },
});

const lectureModel = model("Lecture", lectureSchema);
module.exports = lectureModel;
