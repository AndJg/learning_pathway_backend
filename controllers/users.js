const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const nodemailer = require('nodemailer');
//Register
exports.registerUser = asyncHandler(async (req, res) => {
    // Validate req body
    const { error } = User.validateUser(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // Check if user already exists
    let user = await User.findOne({
        email: req.body.email,
    });
    if (user) {
        return res.status(400).send('Email already in use!');
    }


    const { username, email, password, role } = req.body;

    
    // Create/Register new user
    user = await User.create({
        username,
        email,
        password,
        role,
    });

    sendTokenResponse(user, 200, res);
});

//login
exports.loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    //check password and email in form
    if (!email || !password) {
        return res.status(400).send('Please enter email and password!');
    }

    //Check if user exist
    const user = await User.findOne({
        email,
    }).select('+password');

    if (!user) {
        return res.status(401).send('Invalid credentials');
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return res.status(401).send('Invalid credentials');
    }

    // if(!user.isVerified){
    //     return res.status(401).send('Account not verified!');
    // }


    sendTokenResponse(user, 200, res);
});

//Logout
exports.logout = asyncHandler(async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
      });
    

    res.status(200).json({
        success: true,
        data: {}
    });
});


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

//get cuerrently logged user
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user,
    });
});

//User update Username
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

//forgot password
//find by id.
//send reset token
//check token
//run updatePassword.

//update user details?

//admin users?

//uploadu user photo?

//tasks for today ( date to finish to model)
