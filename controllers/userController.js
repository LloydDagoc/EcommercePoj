// Display the sign-up form

const bcryptjs= require('bcryptjs');
const db = require('../config/db');


exports.getSignupForm = (req, res) => {
    res.render('signup');
};

// Handle sign-up form submission
exports.postSignup = async (req, res) => {
    const { username, email, password } = req.body;

    if (username && email && password) {
        try {
            const hashedPassword = await bcryptjs.hash(password, 10);
            await db.query('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', 
                [username, email, hashedPassword, 'user']);
            req.flash('success_msg', 'Sign-up successful! Please log in.');
            res.redirect('/login');
        } catch (err) {
            req.flash('error_msg', 'Error signing up. Please try again.');
            res.redirect('/signup');
        }
    } else {
        req.flash('error_msg', 'All fields are required!');
        res.redirect('/signup');
    }
};

// Display the login form
exports.getLoginForm = (req, res) => {
    res.render('login');
};

// Handle login form submission
exports.postLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (!user) {
            req.flash('error_msg', 'User not found.');
            return res.redirect('/login');
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            req.flash('error_msg', 'Incorrect password.');
            return res.redirect('/login');
        }

        req.flash('success_msg', 'Login successful! Welcome.');
        res.redirect('/home');  // Change '/dashboard' to your desired user landing page after login
    } catch (err) {
        req.flash('error_msg', 'Error logging in. Please try again.');
        res.redirect('/login');
    }
};
