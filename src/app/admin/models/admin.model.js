const { model, Schema } = require("mongoose");

const adminSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'Role'
    },
  },
  { timestamps: true }
);

const adminModel = model("Admin", adminSchema);

module.exports = adminModel;
