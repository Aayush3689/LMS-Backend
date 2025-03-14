const { Router } = require('express')
const router = Router();
const {handleSendOtp, handleValidateOtp} = require('../controllers/user/user.controller')

router.post('/auth/generate-otp', handleSendOtp)
router.post('/auth/validate-otp', handleValidateOtp)

module.exports = router