const bcrypt = require('bcryptjs');
const db = require('../config/db');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Set destination for image upload
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Filename with timestamp
    }
});
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1000000 },  // Set file size limit (1MB)
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Only images are allowed!');
        }
    }
}).single('image');

// Display the admin login form
exports.getAdminLoginForm = (req, res) => {
    res.render('adminLogin', { error: req.flash('error_msg') });
};

// Handle admin login form submission
exports.postAdminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Fetch admin user by email
        const [admin] = await db.query('SELECT * FROM users WHERE email = ? AND role = "admin"', [email]);

        if (admin.length === 0) {
            req.flash('error_msg', 'Invalid email. Please check your email and try again.');
            return res.redirect('/admin-login');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, admin[0].password);
        if (isPasswordValid) {
            req.session.admin = admin[0];
            req.flash('success_msg', `Welcome, Admin ${admin[0].username}!`);
            return res.redirect('/adminHome');
        } else {
            req.flash('error_msg', 'Invalid password. Please try again.');
            return res.redirect('/admin-login');
        }
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'An error occurred while logging in. Please try again.');
        return res.redirect('/admin-login');
    }
};

// Display add product page
exports.getAddProduct = (req, res) => {
    res.render('addProduct'); // Render the addProduct.ejs view
};

// Handle adding a new product
exports.postAddProduct = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).send('Error uploading file');
        }

        const { name, price, description } = req.body;
        let imageUrl = '';  // Placeholder for image URL

        // Handle file upload or external image URL
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;  // Local uploaded image
        } else if (req.body.imageUrl) {
            imageUrl = req.body.imageUrl;  // External image URL
        }

        try {
            const query = `
                INSERT INTO product (name, price, description, imageUrl, createdAt) 
                VALUES (?, ?, ?, ?, NOW())
            `;
            await db.query(query, [name, price, description, imageUrl]);  // Insert product into the database
            res.redirect('/adminHome');  // Redirect to admin home page
        } catch (err) {
            console.error('Error adding product:', err);
            res.status(500).send('Error adding product');
        }
    });
};
