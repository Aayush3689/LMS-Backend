const { Router } = require('express');
const router = Router();
const {handleSendOtp, handleValidateOtp} = require('../controllers/user/user.controller')


// route for new user registration
router.post('/auth/generate-otp', handleSendOtp);
router.post('/auth/validate-otp', handleValidateOtp);

// export
module.exports = router