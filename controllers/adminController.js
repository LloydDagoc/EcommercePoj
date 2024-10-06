// controllers/adminController.js

const bcrypt = require('bcryptjs');
const db = require('../config/db');

// Display the admin login form
exports.getAdminLoginForm = (req, res) => {
    res.render('adminLogin');
};

// Handle admin login form submission
exports.postAdminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Fetch the user with role 'admin' from the database
        const [admin] = await db.query('SELECT * FROM users WHERE email = ? AND role = "admin"', [email]);

        // Check if the admin was found
        if (!admin) {
            return res.status(401).send('Invalid email or password, or you are not an admin.');
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, admin[0].password);
        if (isPasswordValid) {
            // Admin login successful - save admin session (or use JWT)
            req.session.admin = admin[0]; // Save the admin user session
            req.flash('success_msg', `Welcome, Admin ${admin[0].username}!`);
            return res.redirect('/adminHome'); // Redirect to the admin home page
        } else {
            req.flash('error_msg', 'Invalid email or password.');
            return res.redirect('/admin-login'); // Redirect to the admin login page
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send('Error logging in. Please try again.');
    }

 
};
