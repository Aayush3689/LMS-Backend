const otpGenerator = require("otp-generator");
const connectRedis = require("./services/redis");
const sendOtp = require("./services/whatsapp-api");

// =================================== generate, send and store otp =================================== //
// function that generates otp //
const generateOtp = () => {
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  return otp.toString();
};

const handleSendOtp = async (req, res) => {
  const { mobile } = req.body;

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
        message: `Error while generating otp please try again`,
      });

    // connect to redis
    const client = await connectRedis();
    const redisKey = `otp:${mobile}`;

    // store otp with 5min expiry time
    const setOtpInRedis = await client.set(redisKey, otp, "EX", 20);

    if (!setOtpInRedis) {
      console.log(`otp is not stored in redis`);
      return res.status(500).json({
        success: false,
        message: `something error please try again`,
      });
    }

    // send otp to whatsapp
    await sendOtp(mobile, otp);

    return res.status(200).json({
      success: true,
      message: "otp sent successfully",
    });
  } catch (error) {
    console.error("Error in handleSendOtp:", error);
    return res.json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

// =================================== validate otp =================================== //
const handleValidateOtp = async (req, res) => {
  const { otp, mobile } = req.body;

  if (!otp && !mobile)
    return res.status(400).json({
      success: false,
      message: `otp or mobile is required`,
    });

  try {
    const client = await connectRedis();
    const redisKey = `otp:${mobile}`;

    // Get stored OTP
    const storedOtpInRedis = await client.get(redisKey);

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
    await client.del(redisKey);

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.log(error);
    return error;
  }
};

// =================================== check user =================================== //
const handleCheckUser = async (mobile) => {

}

// exports
module.exports = { handleSendOtp, handleValidateOtp };
