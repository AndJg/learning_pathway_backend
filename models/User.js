const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 3,
        maxlength: 25
    },
    email:{
        type: String,
        required: true,
        tirm: true,
        unique: true,
        minlength: 3,
        maxlength: 255
    },
    password:{
        type: String, 
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 1024
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin'],
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
},{
    versionKey: false
});

function validateUser(user) {
    console.log('Validation started');
    const schema = Joi.object({
        username: Joi.string()
            .min(5)
            .max(50)
            .required(),
        email: Joi.string()
            .min(5)
            .max(255)
            .required()
            .email(),
        password: Joi.string()
            .min(5)
            .max(255)
            .required(),
    },{
        versionKey: false
    });
    return schema.validate(user);
}

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
 
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next()
});

userSchema.methods.getSignedJWT = function() {
    return jwt.sign(
        {
            id: this._id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE,
        }
    );
};


// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


module.exports = mongoose.model('User', userSchema);
module.exports.validateUser = validateUser;