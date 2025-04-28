const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "uploads/courses")
    },

    filename: function(req, file, cb){
        const ext = path.extname(file.originalname);
        cb(null, 'image' + ext);
    }
})

const uploadCourse = multer({storage})

module.exports = uploadCourse;