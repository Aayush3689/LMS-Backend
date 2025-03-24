const { model, Schema } = require('mongoose')

const userSchema = new Schema({
    mobile: {
        type: String,
        required: true,
        unique: true,
    }
}, { timestamps: true })

const userModel = model('user', userSchema);

// 
module.exports = userModel;