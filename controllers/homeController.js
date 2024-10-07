// controllers/homeController.js
const db = require('../config/db');

// Fetch products and render homepage
const getHomePage = async (req, res) => {
    try {
        const [products] = await db.query('SELECT * FROM product');
        res.render('home', { products }); // Pass 'products' to the EJS view
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).send('Error retrieving products');
    }
};

module.exports = { getHomePage };
