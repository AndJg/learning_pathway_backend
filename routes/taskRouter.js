const express = require('express');
const asyncHandler = require('../middleware/async');
const Task = require('../models/Task');
const router = express.Router();

//TAKE TO CONTROLER

//path controller/router /relacje

//get all user tasks
router.get('/', asyncHandler(async (req, res, next) => {

    const tasks = await Task.find();
  

    res.status(200).json({
        success: true,
        data: tasks
    });
}));


//create task -user
router.post('/', asyncHandler(async (req, res, next) => {

    const test = await Test.create(req.body);

    res.status(201).json({
        success: true,
        data: test
    });
}));

//update task
//mark as done
// delete task
//


module.exports = router;
