const asyncHandler = require('../middleware/async');
const User = require('../models/User');

//get one user
exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    res.status(200).json({
        success: true,
        data: user,
    });
});

//get all users -admin only
exports.getAllUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        data: users,
    });
});

//delete user --admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch {
        res.status(404).send('Not found');
    }
});

//User update email
exports.updateEmail = asyncHandler(async (req, res, next) => {
    const email = { email: req.body.email };

    const user = await User.findByIdAndUpdate(req.user.id, email, {
        new: true,
    });

    res.status(200).json({
        success: true,
        data: user,
    });
});

//change username
exports.updateUsername = asyncHandler(async (req, res, next) => {
    const username = { username: req.body.username };

    const user = await User.findByIdAndUpdate(req.user.id, username, {
        new: true,
    });

    res.status(200).json({
        success: true,
        data: user,
    });
});

//User change password
exports.changePassword = asyncHandler(async (res, req, next) => {
    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.matchPassword(req.body.currentPassword))) {
        return res.status(401).send('Wrong password!');
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
});

// Get token from model, create and send response
const sendTokenResponse = (user, statusCode, res) => {
    console.log('Create token');
    const token = user.getSignedJWT();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };

    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
        });
};
