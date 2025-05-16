const userModel = require("@app/users/models/user.model");
const { signToken } = require("@services/JWT/jwt.token");

const handleCheckForTokenMiddleWare = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access Denied",
      });
    }

    const user = signToken(token);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Access Denied or Invalid Token",
      });
    }

    const fullUser = await userModel.findById(user.id).lean();

    if (!fullUser) {
      return res.status(401).json({
        success: false,
        message: "Access Denied",
      });
    }

    req.user = fullUser;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = handleCheckForTokenMiddleWare;
