const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const db = require('../models/db');  // Database connection

// Render signup form
router.get('/signup', (req, res) => {
    res.render('signup');
});

// Render login form
router.get('/login', (req, res) => {
    res.render('login');
});

// Dashboard Route (for logged-in users)
router.get('/dashboard', (req, res) => {
    res.render('dashboard');
});

// Logout Route
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Could not log out.');
        }
        res.redirect('/'); // Redirect to login page after logout
    });
});


// Signup Route
router.post('/signup', (req, res) => {
    const { username, email, password } = req.body;
    console.log(req.body);
    // Hash the password
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) throw err;

        // Insert the user into the database
        const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        db.query(sql, [username, email, hash], (err, result) => {
            if (err) {
                console.error('Database error:', err);  // Log the exact error to the console
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).send('Email already exists.');
                }
                return res.status(500).send('Server error: ' + err.message);
            }
            res.redirect('/auth/login');
        });        
    });
});

// Login Route
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    // Check if the user exists
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err, result) => {
        if (err) return res.status(500).send('Server error.');

        if (result.length === 0) {
            return res.status(400).send('User not found.');
        }

        // Compare passwords
        const user = result[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {

            if (isMatch) {
                // Redirect to dashboard on successful login
                res.redirect('/auth/dashboard');
            } else {
                res.status(400).send('Incorrect password.');
            }
        });
    });
});


module.exports = router;
