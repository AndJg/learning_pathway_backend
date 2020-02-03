const express = require('express');
const router = express.Router();

const { checkToken, authorize } = require('../middleware/auth');
const userController = require('../controllers/users');

router.get('/', checkToken, authorize('admin'), userController.getAllUsers);
router.put('/me/changepassword', checkToken, userController.changePassword);
router.put('/changeusername', checkToken, userController.updateUsername);
router.put('/changeemail', checkToken, userController.updateEmail);
router.get('/:id', checkToken, userController.getUser);
router.delete('/:id', checkToken, authorize('admin'), userController.deleteUser);

module.exports = router;
