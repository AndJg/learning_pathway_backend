const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const pathSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 100,
        },
        description: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 500,
        },
        percentage: {
            type: Number,
            default: 0,
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        toJSON: { virtuals: true},
        toObject: { virtuals: true },
        versionKey: false,
    }
);

function validatePath(path) {
    const schema = Joi.object(
        {
            name: Joi.string()
                .required()
                .min(3)
                .max(100),
            description: Joi.string()
                .required()
                .min(5)
                .max(500),
        },
        {
            versionKey: false,
        }
    );

    return schema.validate(path);
}

pathSchema.virtual('tasks',
{
    ref: 'Task',
    localField: '_id',
    foreignField: 'path',
    justOne: false
});

module.exports = mongoose.model('Path', pathSchema);