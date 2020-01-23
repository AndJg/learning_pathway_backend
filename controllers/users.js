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

exports.confirmUser = asyncHandler(async (req,res) => {
   
    const token = req.params.token;
    const decoded = jwt.verify(token, process.env.EMAIL_SECRET);

        console.log(decoded);
        console.log();
 
  const user = await User.findById(decoded.id);

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

const sendEmail = async (user, email) =>{
    
    //send email with tokenSS

 const token = user.getRegisterToken();
 console.log(token);
 const url =  `http://localhost:3000/api/users/confirmation/${token}`;

    //1.get jwt token from user model
    let transporter = nodemailer.createTransport({
        // host: process.env.SMTP_HOST,
        // port: process.env.SMTP_PORT,
        // secure: false, // true for 465, false for other ports
        // auth: {
        //   user: process.env.SMTP_EMIAL, // generated ethereal user
        //   pass: process.env.SMTP_PASSWORD // generated ethereal password
        // }
        host: "smtp.mailtrap.io",
        port: 2525,
        secure: false,
        auth: {
            user: "5ce1dfa73443cb",
            pass: "05a843a8df1942"
        }
      });
    //2.set transporter
    let info = await transporter.sendMail({
        from: process.env.FROM_EMAIL, // sender address
        to: email, // list of receivers
        subject: process.env.FROM_NAME, // Subject line
        // text: "Hello world?", // plain text body
        html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
      });
    //3.send mail with defined transport object

    console.log("Message sent: %s", info.messageId);
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
