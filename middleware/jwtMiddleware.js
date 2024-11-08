const jwt = require('jsonwebtoken');
const db = require('../models/db'); // Ensure this path is correct

const authenticateJWT = (req, res, next) => {
    const token = req.cookies.jwt; // Assuming you're using cookies
    if (!token) {
        return res.redirect('/auth/login'); // Redirect to login if no token
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.redirect('/auth/login'); // Redirect to login if token is invalid
        }

        // Check if the user exists in the database
        db.query('SELECT * FROM users WHERE id = ?', [decoded.id], (error, results) => {
            if (error || results.length === 0) {
                return res.render('error'); // Render the error page if user is not found
            }

            // Assuming the results contains the full user data, e.g., username, profilePic, etc.
            req.user = results[0];  // Store the full user data in req.user

            next();  // Proceed to the next middleware/route handler
        });
    });
};

module.exports = authenticateJWT;
