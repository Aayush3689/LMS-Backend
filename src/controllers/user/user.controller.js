const userModel = require("../../models/user.model");
const {
  setRedisValue,
  getRedisValue,
  deleteRedisKey,
} = require("../../services/redis/redis.client");
const sendOtp = require("../../services/whatsapp/whatsapp-api");
const generateOtp = require("../user/utils/generate-otp");
const handleCheckUser = require("../user/utils/check-user");
const { generateToken } = require("../user/utils/generate-token");

//======= send and store otp =======//
const handleSendOtp = async (req, res) => {
  let { mobile } = req.body;

  if (!mobile) {
    return res.status(400).json({
      success: false,
      message: "mobile number is required",
    });
  }

  // Ensure mobile number is a string
  if (typeof mobile !== "string") {
    mobile = String(mobile);
  }

  try {
    const otp = generateOtp();
    console.log(`Generated otp: ${otp}`);

    if (!otp)
      return res.status(500).json({
        success: false,
        message: `Error while sending otp please try again`,
      });

    // store otp with 5min expiry time
    const otpKey = `otp:${mobile}`;
    await setRedisValue(otpKey, 300, otp);

    // Send OTP via WhatsApp
    const otpSent = await sendOtp(mobile, otp);
    if (!otpSent.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP, please try again",
      });
    }

    return res.status(200).json({
      success: true,
      message: "otp sent successfully",
    });
  } catch (error) {
    console.log("Error in handleSendOtp:", error);
    return res.json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

// =================== validate otp =================== //
const handleValidateOtp = async (req, res) => {
  const { otp, mobile } = req.body;

  if (!otp && !mobile)
    return res.status(400).json({
      success: false,
      message: `otp or mobile is required`,
    });

  try {
    // Get stored OTP
    const otpKey = `otp:${mobile}`;
    const storedOtpInRedis = await getRedisValue(otpKey);

    if (!storedOtpInRedis) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired or is invalid",
      });
    }

    if (otp !== storedOtpInRedis)
      return res.status(400).json({
        success: false,
        message: `otp is invalid`,
      });

    // OTP verified successfully, remove OTP from Redis
    const isOtpDeleted = await deleteRedisKey(otpKey);

    if (!isOtpDeleted) {
      console.log(`otp is not deleted from redis after verification`);
    }

    // check user
    const user = await handleCheckUser(mobile);

    // send jwt token
    const token = generateToken(user);

    if (!token) {
      console.log(`error while generating the jwt token`);
      return;
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    return error;
  }
};

// exports
module.exports = { handleSendOtp, handleValidateOtp };
