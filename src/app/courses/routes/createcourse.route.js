const {Router} = require('express');
const router = Router();
const uploadCourse = require('@middlewares/multer/multer.course')
const handleCreateCourse = require('../controllers/createcourse.controller');

router.post('/course/add-course', uploadCourse.single('thumbnail'), handleCreateCourse)

module.exports = router