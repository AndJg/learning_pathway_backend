const express = require('express');
const router = express.Router();

const {checkToken, authorize} = require('../middleware/auth');
const userController = require('../controllers/users');


router.get('/',checkToken, authorize('admin'), userController.getAllUsers);
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/me', checkToken, userController.getMe);
router.put('/me/changepassword', checkToken, userController.changePassword);
router.get('/:id',checkToken, userController.getUser);
router.delete('/:id',checkToken, authorize('admin'), userController.deleteUser);
router.put('/:id',checkToken, userController.updateUserInfo);



module.exports = router;