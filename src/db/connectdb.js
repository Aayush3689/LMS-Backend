const mongoose = require('mongoose');

const connectDb = async (uri) => {
    try {
        await mongoose.connect(uri);
        console.log('mongodb connected successfully')
    } catch (error) {
        console.log(`Error while connecting with the database: ${error}`)
        return {
            errorMessage: error
        }
    }
}

module.exports = connectDb