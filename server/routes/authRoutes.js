const express = require('express');
const router = express.Router();

const { checkToken } = require('../middleware/auth');
const authController = require('../controllers/auth');

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.get('/logout', authController.logout);
router.get('/me', checkToken, authController.getMe);
router.put('/confirmation/:token', authController.confirmUser);

module.exports = router;
