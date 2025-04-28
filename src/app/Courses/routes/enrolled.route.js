const {Router} = require('express');
const router = Router();
const handleCheckForTokenMiddleWare = require('@middlewares/auth/auth.middleware');
const handleEnrolledCourse = require('../controllers/enrolled.controller');

router.get('/enrolled', handleCheckForTokenMiddleWare, handleEnrolledCourse)

module.exports = router