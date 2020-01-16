const asyncHandler = require('../middleware/async');
const Task = require('../models/Task');


//get all user tasks
exports.getAllTasks = asyncHandler(async (req, res, next) => {
    const tasks = await Task.find();

    res.status(200).json({
        success: true,
        data: tasks,
    });
});


//get one task by id
exports.getOneTask = asyncHandler(async (req, res, next) => {
   
    const task = await Task.findById(req.params.id);
    if (!task) {
        res.status(404).send('Task not found');
    }

    res.status(200).json({
        success: true,
        data: task,
    });

});

exports.createTask = asyncHandler(async (req, res, next) => {
    // Validate req body!!!!
    req.body.user = req.user.id;

    let task = await Task.findOne({
        name: req.body.name,
    });

    if (task) {
        res.status(400).send(`Task with ${req.body.name} name already exisits!`);
    }

    task = await Task.create(req.body);

    res.status(200).json({
        success: true,
        data: task,
    });
});

//update task
exports.updateTask = asyncHandler(async (req, res, next) => {
    let task = await Task.findById(req.params.id);

    if (!task) {
        res.status(404).send('Task with the given id was not found.');
    }

    if (task.user.toString() !== req.user.id) {
        res.status(401).send('User not authorized to update task!');
    }

    task = await Task.findOneAndUpdate(req.params.id, req.body, {
        new: true,
    });

    res.status(200).json({
        success: true,
        data: task,
    });
});

// delete task
exports.deleteTask = asyncHandler(async (req, res, next) => {
    let task = await Task.findById(req.params.id);

    if (!task) {
        res.status(404).send('Task with the given id was not found.');
    }

    if (task.user.toString() !== req.user.id) {
        res.status(401).send('User not authorized to delete this task!');
    }

    task.remove();

    res.status(200).json({
        success: true,
        data: {},
    });
});
