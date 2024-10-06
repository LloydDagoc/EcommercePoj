// routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Route to display the admin login form
router.get('/admin-login', adminController.getAdminLoginForm);

// Route to handle admin login form submission
router.post('/admin-login', adminController.postAdminLogin);

// Route to access admin home after successful login
router.get('/adminHome', (req, res) => {
    // Check if the admin is logged in
    if (req.session.admin) {
        res.render('adminHome', { admin: req.session.admin }); // Pass admin data to the view
    } else {
        res.redirect('/admin-login'); // Redirect to login if not authorized
    }
});

module.exports = router;
