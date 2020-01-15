const express = require('express');
const router = express.Router();

const {checkToken, authorize} = require('../middleware/auth');
const taskController = require('../controllers/task');



router.get('/',checkToken, authorize('user', 'admin'), taskController.getAllTasks);
router.post('/create',checkToken, taskController.createTask);
router.get('/:id',checkToken, taskController.getOneTask);
router.put('/:id', checkToken, taskController.updateTask);
router.delete('/:id', checkToken, authorize('user'), taskController.deleteTask);

module.exports = router;
