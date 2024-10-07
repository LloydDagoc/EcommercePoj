const db = require('../config/db'); // Database connection

// View Cart
exports.viewCart = async (req, res) => {
    try {
        // Query to fetch cart items and their details from the products table
        const query = `
            SELECT p.name, p.price, ci.quantity, (p.price * ci.quantity) AS total 
            FROM cart_items ci
            JOIN product p ON ci.product_id = p.id
        `;
        
        // Execute the query and fetch cart items
        const cartItems = await db.query(query);

        // Pass the results to the view (cart.ejs)
        const success_msg = req.query.success_msg; // Optional success message from query params
        res.render('cart', { cartItems: cartItems[0], success_msg: success_msg }); // cartItems[0] contains the result
    } catch (err) {
        console.error('Error fetching cart items:', err);
        return res.status(500).send('Server error');
    }
};

// Add Item to Cart
exports.addToCart = async (req, res) => {
    const productId = req.params.id;
    const quantity = 1; // Default quantity to add

    // Check if the product is already in the cart
    const checkQuery = 'SELECT * FROM cart_items WHERE product_id = ?';
    const insertQuery = 'INSERT INTO cart_items (product_id, quantity) VALUES (?, ?)';
    const updateQuery = 'UPDATE cart_items SET quantity = quantity + 1 WHERE product_id = ?';

    try {
        // Check if the product already exists in the cart
        const [existingItem] = await db.query(checkQuery, [productId]);

        if (existingItem.length > 0) {
            // If the product is already in the cart, update the quantity
            await db.query(updateQuery, [productId]);
        } else {
            // If the product is not in the cart, insert a new entry
            await db.query(insertQuery, [productId, quantity]);
        }

        // Redirect to the cart with a success message
        res.redirect('/cart?success_msg=Product added to cart successfully');
    } catch (err) {
        console.error('Error adding item to cart:', err);
        return res.status(500).send('Server error');
    }
};
