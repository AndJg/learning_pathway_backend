const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
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

    // get the user email from? params?

    sendEmail(user, req.body.email);

    sendTokenResponse(user, 200, res);
});

exports.confirmUser = asyncHandler(async (req, res) => {
    const token = req.params.token;
    const decoded = jwt.verify(token, process.env.EMAIL_SECRET);

    const user = await User.findById(decoded.id);

    user.isVerified = true;
    await user.save();

    res.status(200).json({
        success: true,
        data: user,
    });
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

    if (!user.isVerified) {
        return res.status(401).send('Account not verified!');
    }

    sendTokenResponse(user, 200, res);
});

//Logout
exports.logout = asyncHandler(async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        data: {},
    });
});

//get cuerrently logged user
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user,
    });
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

const sendEmail = async (user, email) => {
    //1.get jwt token from user model
    const token = user.getRegisterToken();
    const url = `http://localhost:5000/api/users/confirmation/${token}`;

    //2.set transporter
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    let info = await transporter.sendMail({
        from: process.env.FROM_EMAIL, // sender address
        to: email, // list of receivers
        subject: process.env.FROM_NAME, // Subject line
        html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
    });

    //3.send mail with defined transport object
    console.log('Message sent: %s', info.messageId);
};
