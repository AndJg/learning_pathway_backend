const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const taskSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            minlength: 5,
            maxlength: 50,
        },
        markedAsDone: {
            type: Boolean,
            default: false,
        },
        creationDate: {
            type: Date,
            default: Date.now(),
        },
        timeNeededToLearn: {
            type: Number,
            default: 0,
        },
        materials: {
            type: Array,
            default: [],
        },
        intervals: {
            type: Number,
            enum: [25, 30.35],
        },
        notes: {
            type: String,
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        versionKey: false,
    }
);

function validateTask(task) {
    const schema = Joi.object(
        {
            name: Joi.string()
                .required()
                .min(5)
                .max(50),
            timeNeededToLearn: Joi.number(),
            intervals: Joi.number(),
            notes: Joi.string(),
        },
        {
            versionKey: false,
        }
    );
    return schema.validate(task);
}

module.exports = mongoose.model('Task', taskSchema);
