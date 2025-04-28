const otpGenerator = require('otp-generator')

const generateOtp = () => {
    const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
  
    return otp.toString();
  };

//
module.exports = generateOtp;