const express = require('express');
const router = express.Router();
const { register, login, updatePassword } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateUser } = require('../middleware/validateMiddleware');

router.post('/register', validateUser, register);
router.post('/login', login);
router.put('/update-password', authMiddleware, updatePassword);

module.exports = router;
