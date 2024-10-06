const express = require('express');
const router = express.Router();

const users = [
    { email: 'user@example.com', password: 'password123' } // Sample user
];


const authenticateUser = (email, password) => {
    // Check if the user exists and the password matches
    const user = users.find(user => user.email === email);
    return user && user.password === password; // Replace this with secure password checking (e.g., hashing)
};

// Login route
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Authenticate user
    if (authenticateUser(email, password)) {
        // Set user session or token if using
        req.session.user = { email }; // Example for session-based auth
        // Redirect to home page
        res.redirect('/home'); // Change to your actual home route
    } else {
        // Set error message and redirect back to login
        req.flash('error_msg', 'Invalid email or password');
        res.redirect('/login'); // Redirect back to login page
    }
});

// Export the router
module.exports = router;
