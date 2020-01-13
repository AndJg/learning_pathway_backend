const User = require('../models/User');
const asyncHandler = require('./async');
const jwt = require('jsonwebtoken');

exports.checkToken = asyncHandler(async (req, res, next) => {

     let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    // else if(req.cookies.token){
    //     token = req.cookies.token

    // }

    if (!token) {
        return res.status(401).send('Not authorized to access this route.');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log(decoded);
        req.user = await User.findById(decoded.id);

        next();
    } catch (error) {
        return res.status(400).send('Bad Token.');
    }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res
                .status(403)
                .send(`${req.user.name} role '${req.user.role}' is not authorized to access this route.`);
        }
        next();
    };
};
