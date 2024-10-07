const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Route to add an item to the cart
router.get('/cart/:id', cartController.addToCart); 

// Route to view cart
router.get('/cart', cartController.viewCart); 

module.exports = router;
