// controllers/adminController.js
const db = require('../config/db');
const multer = require('multer');

// Function to update product information
const updateProduct = async (req, res) => {
    console.log('Received request to update product:', req.params.id); // Log the request
    const productId = req.params.id;
    const { name, price, description, imageUrl } = req.body; // Get values from the form

    try {
        const query = `
            UPDATE products 
            SET name = ?, price = ?, description = ?, imageUrl = ?, updatedAt = NOW() 
            WHERE id = ?
        `;
        await db.query(query, [name, price, description, imageUrl, productId]); // Execute update
        res.redirect(`/admin/update-product/${productId}?success=true`); // Redirect with success message
    } catch (err) {
        console.error('Error updating product:', err);
        return res.status(500).send('Error updating product');
    }
};

module.exports = {
    updateProduct,
};
