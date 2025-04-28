const { generateAccessToken } = require("../../../services/JWT/jwt.token");
const {
  setRedisValue,
  getRedisValue,
  deleteRedisKey,
} = require("../../../services/redis/redis.client");
const sendOtp = require("../../../services/whatsapp/whatsapp-api");
const handleCheckUser = require("../utils/check-user");
const generateOtp = require("../utils/otp");

// Generate and send OTP function
const genarateAndSendOtp = async (mobile) => {
  try {
    const otp = generateOtp();
    console.log(`Generated otp: ${otp}`);

    if (!otp)
      return res.status(500).json({
        success: false,
        message: `Error while generating OTP`,
      });

    // Send OTP via WhatsApp
    // const response = await sendOtp(mobile, otp);
    // if (!response?.success) {
    //   return {
    //     success: false,
    //     message: response.message,
    //     status: 400,
    //   };
    // }

    // store otp with 5min expiry time
    const otpKey = `otp:${mobile}`;
    await setRedisValue(otpKey, 300, otp);

    return {
      success: true,
      message: "otp sent successfully",
      status: 200,
      otp,
    };
  } catch (error) {
    console.log("Error in handleSendOtp:", error);
    return {
      success: false,
      message: `Internal Server Error: ${error.message}`,
      status: 500,
    };
  }
};

// Validate OTP function
const validateOtp = async (otp, mobile) => {
  try {
    // Get stored OTP
    const otpKey = `otp:${mobile}`;
    const storedOtpInRedis = await getRedisValue(otpKey);

    if (!storedOtpInRedis) {
      return {
        success: false,
        message: "OTP has expired",
        status: 400,
      };
    }

    if (otp !== storedOtpInRedis)
      return {
        success: false,
        message: "otp is invalid",
        status: 400,
      };

    // OTP verified successfully, remove OTP from Redis
    await deleteRedisKey(otpKey);

    // check user
    const data = await handleCheckUser(mobile);
    if (!data?.success) {
      return {
        success: false,
        message: DataTransferItem.message,
        status: 400,
      };
    }

    // send jwt token
    const token = generateAccessToken(data.user);

    if (!token) {
      console.log(`error while generating the jwt token`);

      return {
        success: false,
        message: "Unexpected token error please try again",
        status: 500,
      };
    }

    return {
      success: true,
      message: "OTP verified successfully",
      status: 200,
      user: data.user,
      token,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message:
        error.message || error.response?.data || "Unexpected error try again!",
        status: 500,
    };
  }
};

// export all the functions
module.exports = { genarateAndSendOtp, validateOtp };
