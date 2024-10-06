// routes/homeRoutes.js

const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

// Route for the homepage
router.get('/home', homeController.getHomePage);

module.exports = router;
