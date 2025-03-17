const JWT = require('jsonwebtoken');

// 
const generateToken = (user) => {
    const payload = {
        mobile: user.mobile,
        id: user._id
    }

    const token = JWT.sign(payload, process.env.JWT_SECRET_KEY);

    return token;
}

const validateToken = (token) => {
    const payloadUser = JWT.verify(token, process.env.JWT_SECRET_KEY);
    return payloadUser;
}

module.exports = {generateToken, validateToken}