const JWT = require("jsonwebtoken");

// generate token
const generateAccessToken = (user) => {
  try {
    const payload = {
      mobile: user.mobile,
      id: user._id,
    };

    const token = JWT.sign(payload, process.env.JWT_SECRET_KEY);
    return token;
  } catch (error) {
    console.log(
      `error while generating a token in handleGenerateToken: ${error}`
    );
    return null;
  }
};

// validate token
const signToken = (token) => {
  try {
    return JWT.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    console.log(
      `error while validating the token in handleValidateToken: ${error}`
    );
    return null;
  }
};

module.exports = { generateAccessToken, signToken };
