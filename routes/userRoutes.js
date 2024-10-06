// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const loginController = require('../controllers/loginController');

// Sign-up routes
router.get('/signup', userController.getSignupForm);
router.post('/signup', userController.postSignup);

// Login routes
router.get('/login', loginController.getLoginForm);
router.post('/login', loginController.postLogin);

module.exports = router;
