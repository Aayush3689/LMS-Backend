const { model, Schema } = require("mongoose");

const courseSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, 'title is required'],
      validate: {
        validator: (v) => v.trim().length > 0,
        message: 'Title can not be empty'
      }
    },

    description: {
      type: String,
      trim: true,
      required: true
    },

    thumbnail: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      default: 0,
      min: [0, 'Price can not be nagiative'],
      required: true
    },

    status: {
      type: String,
    }
  },
  { timestamps: true }
);
const courseModel = model("Course", courseSchema);
module.exports = courseModel;

courseSchema.pre('save', () => {
  console.log('pre data', this)
})
