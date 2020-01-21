const asyncHandler = require('../middleware/async');
const Path = require('../models/Path');

//Get all paths
exports.getAllPaths = asyncHandler(async(req,res,next) => {

    const paths = await Path.find();

    res.status(200).json({
        success: true,
        data: paths,
    });

});

//Get one path
exports.getPath = asyncHandler(async(req,res,next) => {
    const path = Path.findByIdI(req.params.id);

    if (!path) {
        res.status(404).send('path not found');
    }

    res.status(200).json({
        success: true,
        data: path,
    });
});

//Search Path 

exports.searchForPath = asyncHandler(async(req,res,next) => {

    const path = await Path.find({ name: new RegExp(`.*${req.params.name}.*`, 'i') });

    if (!path) {
        res.status(404).send('path not found');
    }
    
    res.status(200).json({
        success: true,
        data: path,
    });
});
//Add path

exports.createPath = asyncHandler(async(req,res,next) =>{

    req.body.user = req.user.id;

    let path = await Path.findOne({name:req.body.name});

    if (path) {
        res.status(400).send(`Task with ${req.body.name} name already exisits!`);
    }

    path = await Path.create(req.body);

    res.status(200).json({
        success: true,
        data: path,
    });
});
//Update Path 

exports.updatePath = asyncHandler(async(req,res, next) => {

    let path = await Path.findById(req.params.id);

    if (!path) {
        res.status(404).send('path with the given id was not found.');
    }

    if (path.user.toString() !== req.user.id || user.role !== 'admin') {
        res.status(401).send('User not authorized to update path!');
    }

    path = await Path.findOneAndUpdate(req.params.id, req.body, {
        new: true,
    });

    res.status(200).json({
        success: true,
        data: path,
    });
});

//Delete path
exports.deletePath = asyncHandler(async (req, res, next) => {
    let path = await Path.findById(req.params.id);

    if (!path) {
        res.status(404).send('path with the given id was not found.');
    }

    if (path.user.toString() !== req.user.id || user.role !== 'admin') {
        res.status(401).send('User not authorized to delete this path!');
    }

    path.remove();

    res.status(200).json({
        success: true,
        data: {},
    });
});


