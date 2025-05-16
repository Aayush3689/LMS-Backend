const {Router} = require('express');
const handleUploadLecture = require('../controllers/lectures.controller');
const uploadLecture = require('@middlewares/multer/multer.lecture');
const router = Router();

router.post('/lectures/upload', uploadLecture.single('video'), handleUploadLecture);

module.exports = router;