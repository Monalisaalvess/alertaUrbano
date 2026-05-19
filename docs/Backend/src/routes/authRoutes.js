const express = require('express');
const router = express.Router();
const { register, verifyEmail, login, getMe } = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/auth');

router.post('/register', register);
router.get('/verify/:token', verifyEmail);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);

module.exports = router;