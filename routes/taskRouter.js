const express = require('express');
const asyncHandler = require('../middleware/async');
const taskController = require('../controllers/task');
const router = express.Router();


router.get('/',checkToken, authorize('user'), taskController.getAllTasks);
router.post('/create',checkToken, authorize('user'), taskController.createTask);
router.get('/:id',checkToken, authorize('user'), taskController.getOneTask);
router.put('/:id', checkToken, authorize('user'), taskController.updateTask);
router.delete('/:id', checkToken, authorize('user'), taskController.deleteTask);

module.exports = router;
