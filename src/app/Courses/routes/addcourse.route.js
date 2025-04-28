const {Router} = require('express');
const router = Router();
const uploadCourse = require('@middlewares/multer/multer.course')
const handleCheckForTokenMiddleWare = require('@middlewares/auth/auth.middleware');
const handleAddCourse = require('../controllers/addcourse.controller');

router.post('/course/add-course', uploadCourse.single('media'), handleAddCourse)

module.exports = router