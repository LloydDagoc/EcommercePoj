// Display the homepage


exports.getHomePage = (req, res) => {
    // Check if the user is logged in
    if (req.session.user) {
        // Render the homepage and pass user information to the view
        res.render('home', { user: req.session.user });
    } else {
        // If the user is not logged in, redirect to login page
        req.flash('error_msg', 'Please log in to access the homepage.');
        res.redirect('/login');
    }
};
