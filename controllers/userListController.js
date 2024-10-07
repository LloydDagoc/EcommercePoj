// controllers/adminController.js
const db = require('../config/db'); // Ensure you have the correct path for the DB connection

// Function to get the user list
// controllers/userListController.js

const getUserList = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM users'); // Use promise-based db.query
        res.render('userList', { users: results });
    } catch (err) {
        console.error('Error fetching users:', err);
        return res.status(500).send('Error fetching users');
    }
};

module.exports = {
    getUserList
};

