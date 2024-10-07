const express = require('express');
const router = express.Router();
const db = require('../config/db'); 
const adminController = require('../controllers/adminController');
const userListController = require('../controllers/userListController');
const updateProdController = require('../controllers/updateProdController');
const homeController = require('../controllers/homeController');

// Route to render the update form for a product
router.get('/admin/update-product/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        // Query to get the product details by ID
        const [product] = await db.query('SELECT * FROM product WHERE id = ?', [productId]);

        // Render the updateProduct.ejs view, passing the product details
        res.render('updateProduct', { product: product[0] });
    } catch (err) {
        console.error('Error fetching product for update:', err);
        res.status(500).send('Error fetching product for update');
    }
});

// Route to handle the update form submission
router.post('/update-product/:id', updateProdController.updateProduct);

// Route to access admin home after successful login
router.get('/adminHome', async (req, res) => {
    // Check if the admin is logged in
    if (!req.session.admin) {
        return res.redirect('/admin-login'); // Redirect to login if not authorized
    }

    try {
        // Query the database to get the products using promises
        const [results] = await db.query('SELECT * FROM product');
        
        // Render the adminHome.ejs view with the fetched products
        res.render('adminHome', { 
            admin: req.session.admin, 
            products: results // Pass the products from the DB to the view
        });
    } catch (err) {
        console.error('Error fetching products:', err);
        return res.status(500).send('Error fetching products');
    }
});

// User List Route
router.get('/user-list', userListController.getUserList);

// User Home Route
router.get('/user-home', homeController.getHomePage);

// Admin login routes are handled in adminController, so remove duplicates
router.get('/admin-login', adminController.getAdminLoginForm);
router.post('/admin-login', adminController.postAdminLogin);
router.get('/add-product', adminController.getAddProduct);

// Handle form submission for adding product (with file upload)
router.post('/add-product', adminController.postAddProduct);


module.exports = router;
