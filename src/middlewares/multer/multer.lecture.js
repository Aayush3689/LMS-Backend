const multer = require("multer");
const path = require('path')
const {v4: uuid} = require('uuid');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/lectures");
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const randomString = uuid();
    cb(null, "lecture" + randomString + ext);
  },
});

const uploadLecture = multer({storage});

module.exports = uploadLecture;