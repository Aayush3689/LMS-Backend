const multer = require('multer');
const path = require('path');
const { v4: uuid } = require("uuid");

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "uploads/courses/thumbnails")
    },

    filename: function(req, file, cb){
        const ext = path.extname(file.originalname);
        const thumbnailId = uuid();
        cb(null, thumbnailId + ext);
    }
})

const uploadCourse = multer({storage})

module.exports = uploadCourse;