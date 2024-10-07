const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session'); // Session management
const flash = require('connect-flash');
const path = require('path');

const app = express();
const PORT = 3000;

// Import routes
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const homeRoutes = require('./routes/homeRoutes');
const loginRoutes = require('./routes/loginRoutes');
const cartRoutes = require('./routes/cartRoutes');
 // Changed to plural form for consistency

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));

// Set up EJS for templating
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Adjust path as necessary

// Express session middleware
app.use(session({
    secret: 'yourSecretKey',  // Replace with a strong, secure key in production
    resave: false,            // Don't save session if unmodified
    saveUninitialized: true,  // Save uninitialized sessions
    cookie: { secure: false } // Set to true if using HTTPS, otherwise false for development
}));

// Connect flash for flash messages
app.use(flash());

// Middleware to expose flash messages to all views
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

// Use routes
app.use('/', homeRoutes);         // Home routes
app.use('/', userRoutes);         // User routes
app.use('/', adminRoutes);        // Admin routes
app.use('/', loginRoutes);        // Login routes
app.use('/', cartRoutes);         // Cart routes
  // Add product routes

// Route for the root URL
app.get('/', (req, res) => {
    res.redirect('/signup'); // Redirect to signup or login page
});

// Login route (GET)
app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// Login route (POST)
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const adminUsername = 'admin'; // Hardcoded for now, can be replaced with DB check
    const adminPassword = 'password'; // Hardcoded password

    if (username === adminUsername && password === adminPassword) {
        req.session.loggedIn = true;  // Set session flag
        res.redirect('/admin');        // Redirect to admin dashboard after login
    } else {
        req.flash('error_msg', 'Invalid username or password');
        res.render('login', { error: 'Invalid username or password' });
    }
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy(); // Destroy the session and log the user out
    res.redirect('/login'); // Redirect to the login page
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
