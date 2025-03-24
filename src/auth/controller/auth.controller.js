const {
  genarateAndSendOtp,
  validateOtp,
} = require("../services/auth.services");

//======= send otp controller =======//
const handleGenerateOtp = async (req, res) => {
  try {
    let { mobile } = req.body;

    if (!mobile) {
      console.log("mobile no. not recieved", mobile);
      return res.status(400).json({
        success: false,
        message: "mobile number is required",
      });
    }

    // Ensure mobile number is a string
    if (typeof mobile !== "string") {
      mobile = String(mobile);
    }

    const result = await genarateAndSendOtp(mobile);
    if (!result.success) return res.status(`result.status`).json({
      success: result.success,
      message: result.message,
    });

    return res.status(result.status).json({
      success: result.success,
      message: result.message,
      otp: result.otp,
    });
  } catch (error) {
    console.log(`error in handleSendOtp: ${error}`);

    return res.status(500).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

//======= validate otp controller =======//
const handleValidateOtp = async (req, res) => {
  try {
    const { otp, mobile } = req.body;

    if (!otp && !mobile)
      return res.status(400).json({
        success: false,
        message: `otp or mobile is required`,
      });

    const result = await validateOtp(otp, mobile);
    if (!result?.success) return res.status(result.status).json({
      success: result.success,
      message: result.message,
    });

    return res.status(result.status).json({
      success: result.success,
      message: result.message,
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    console.log(`error in handleValidateOtp: ${error}`);
    return res.status(500).json({
      success: false,
      message:
        error.message || error.response?.data || "Unexpected error try again!",
    });
  }
};

//======= validate token controller =======//
const handleValidateToken = (req, res) => {
  const user = req.user;

  return res.status(200).json({
    success: true,
    user,
  });
};

// export functions
module.exports = { handleGenerateOtp, handleValidateOtp, handleValidateToken };
