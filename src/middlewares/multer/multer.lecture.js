const multer = require("multer");
const path = require("path");
const { v4: uuid } = require("uuid");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../../uploads/lectures"); 
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const randomString = uuid();
    cb(null, "lecture-" + randomString + ext);
  },
});

const uploadLecture = multer({ storage });

module.exports = uploadLecture;
