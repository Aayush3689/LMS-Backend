const { model, Schema } = require("mongoose");

const roleSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    permissions: {
        type: [String],
    }
}, { timestamps: true})

const roleModel = model('Role', roleSchema);