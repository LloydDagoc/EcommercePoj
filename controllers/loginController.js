// controllers/loginController.js
//Display the login form for user

const bcryptjs = require('bcryptjs');
const db = require('../config/db');

//Display the login form
exports.getLoginForm = (req, res) => {
    res.render('login'); // Ensure this renders the correct login view
};

// Handle login form submission
exports.postLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Fetch user from the database
        const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        // Check if user exists
        if (user.length === 0) {
            req.flash('error_msg', 'No user found with this email.');
            return res.redirect('/login'); // Redirect back to login if no user found
        }

        // Check if the password matches
        const isMatch = await bcryptjs.compare(password, user[0].password);

        if (!isMatch) {
            req.flash('error_msg', 'Incorrect password.');
            return res.redirect('/login'); // Redirect back to login if password does not match
        }

        // If successful, set user session
        req.session.user = { id: user[0].id, email: user[0].email }; // Save necessary user info in the session

        // Flash a success message and redirect to the homepage
        req.flash('success_msg', 'Login successful! Welcome.');
        return res.redirect('/home'); // Ensure this points to your homepage route
    } catch (err) {
        console.error('Error logging in:', err);
        req.flash('error_msg', 'Error logging in. Please try again.');
        return res.redirect('/login'); // Redirect back to login on error
    }
};
