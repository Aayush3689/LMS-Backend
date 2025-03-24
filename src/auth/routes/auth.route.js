const { Router } = require("express");
const router = Router();
const {
  handleGenerateOtp,
  handleValidateOtp,
  handleValidateToken,
} = require("../controller/auth.controller");
const handleCheckForTokenMiddleWare = require("../../middlewares/auth/auth.middleware");

router.post("/auth/generate-otp", handleGenerateOtp);
router.post("/auth/validate-otp", handleValidateOtp);
router.post("/auth/validate-token", handleCheckForTokenMiddleWare, handleValidateToken);

module.exports = router;
