const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const upload = require('../middlewares/uploadMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', upload.single('myFile'), authController.addUser);
router.post('/login', authController.loginUser);
router.get('/profile', authMiddleware, authController.getProfile);


module.exports = router;