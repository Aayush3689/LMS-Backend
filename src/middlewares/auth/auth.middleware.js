const { signToken } = require('../../services/JWT/jwt.token')

const handleCheckForTokenMiddleWare = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if(!token){
        return res.status(401).json({
            success: false,
            message: 'Access Denied',
        })
    }

    const user = signToken(token);

    if(!user) {
        return res.status(401).json({
            success: false,
            message: 'Access Denied or Invalid Token',
        })
    }

    req.user = user;
    next();

}

// 
module.exports = handleCheckForTokenMiddleWare;