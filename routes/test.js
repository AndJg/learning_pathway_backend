const express = require('express');
const asyncHandler = require('../middleware/async');
const Test = require('../models/Test');
const router = express.Router();

router.get('/', asyncHandler(async (req, res, next) => {

    const tests = await Test.find();

    res.status(200).json({
        success: true,
        data: tests
    });
}));

router.post('/', asyncHandler(async (req, res, next) => {

    const test = await Test.create(req.body);

    res.status(201).json({
        success: true,
        data: test
    });
}));

module.exports = router;
