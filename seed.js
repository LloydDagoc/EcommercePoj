const bcryptjs = require('bcryptjs');
const db = require('./config/db');  // Import your database configuration

const createAdmin = async () => {
    try {
        const username = 'adminUser';
        const email = 'admin@example.com';
        const plainPassword = 'admin12345'; // Plain admin password
        const role = 'admin';

        // Hash the admin password using bcryptjs
        const hashedPassword = await bcryptjs.hash(plainPassword, 10);

        // Insert admin into the database
        const [result] = await db.query('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', 
            [username, email, hashedPassword, role]);

        console.log('Admin user inserted with ID:', result.insertId);
        process.exit();  // Exit the process once done
    } catch (err) {
        console.error('Error inserting admin user:', err);
        process.exit(1);  // Exit with an error code
    }
};

createAdmin();
