const asyncHandler = require('../middleware/async');
const Task = require('../models/Task');


//TAKE TO CONTROLER

//path controller/router /relacje

//get all user tasks

exports.getAllTasks = asyncHandler(async(req, res, next) =>{

    const tasks = await Task.find();
   
    res.status(200).json({
        success: true,
        data: tasks
    });
   
   });
   
   exports.getOneTask = asyncHandler(async(req,res,next) => {
        
       try{
           const task = await Task.findById(req.params.id);
   
           req.status(200).json({
               success: true,
               data: task
           });
       }catch{
       
           res.status(404).send('Task not found');
       }
   });
   
   exports.createTask = asyncHandler(async(req,res,next) =>{
   
      // Validate req body
   
   
      let task = await Task.findOne({
          name: req.body.name
      });
   
      if(task){ res.status(400).send(`Task with ${req.body.name} name already exisits!`);}
   
      task = await Task.create({
          name: req.body.name, 
          timeNeededToLearn: req.body.timeNeededToLearn,
          materials: req.body.materials,
          notes: req.body.notes,
          user: req.user.id,
      })
   
   });
   
   
   //update task
   exports.updateTask = asyncHandler(async(req,res,next) => {
       try{ 
           const task = Task.findByIdAndUpdate(req.body.id);
           res.status(200).json({
               success: true,
               data: task
           });
       }catch{
           res.status(404).send('Task with the given id was not found.');
       }
   });
   
   
   //mark as done
   
   // delete task
   
   exports.deleteTask = asyncHandler(async(req, res, next) =>{
       try {
           const task = Task.findByIdAndDelete(req.params.id);
   
           res.status(200).json({
               success: true,
               message: 'Task deleted successfuly!'
           })
       } catch {
           
           res.status(404).send('Task with the given id was not found.');
       }
   
   });
   //