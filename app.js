// app.js

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');

const app = express();
const PORT = 3000;

// Import routes
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const homeRoutes = require('./routes/homeRoutes'); 



// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Adjust path as necessary
app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

// Middleware to expose flash messages to views
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

// Use routes
app.use('/', userRoutes);
app.use('/', adminRoutes);
app.use('/', homeRoutes);

// Ensure this is included to handle /home route

// Route for the root URL
app.get('/', (req, res) => {
    res.redirect('/signup'); // Redirect to login or another route as appropriate
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


// Manage Products route
app.get('/manage-products', (req, res) => {
    if (!req.session.loggedIn) {
        return res.redirect('/login');
    }
    res.render('manageProducts', { products });
});

// Add Product route (POST method)
app.post('/add-product', (req, res) => {
    if (!req.session.loggedIn) {
        return res.redirect('/login');
    }
    products.push({ name: req.body.productName, price: req.body.productPrice });
    res.redirect('/manage-products');
});

// Manage Users route
app.get('/manage-users', (req, res) => {
    if (!req.session.loggedIn) {
        return res.redirect('/login');
    }
    res.render('manageUsers', { users });
});

// View Orders route
app.get('/view-orders', (req, res) => {
    if (!req.session.loggedIn) {
        return res.redirect('/login');
    }
    res.render('viewOrders', { orders });
});

// Login route
app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === adminUsername && password === adminPassword) {
        req.session.loggedIn = true;
        res.redirect('/admin');
    } else {
        res.render('login', { error: 'Invalid username or password' });
    }
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
