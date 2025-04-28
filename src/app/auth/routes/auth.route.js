const { Router } = require("express");
const router = Router();
const {
  handleGenerateOtp,
  handleValidateOtp,
  handleValidateToken,
} = require("../controller/auth.controller");
const handleCheckForTokenMiddleWare = require("@middlewares/auth/auth.middleware.js");

router.post("/auth/generate-otp", handleGenerateOtp);
router.post("/auth/validate-otp", handleValidateOtp);
router.get("/auth/validate-token", handleCheckForTokenMiddleWare, handleValidateToken);

module.exports = router;
