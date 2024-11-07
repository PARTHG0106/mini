require('dotenv').config();
const passport = require("passport");
const jwtSecret = process.env.JWT_SECRET;
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const db = require('../models/db'); // Database connection
const jwt = require('jsonwebtoken'); 
const authenticateJWT = require('../middleware/jwtMiddleware');

// Render signup form
router.get('/signup', (req, res) => {
    res.render('login', { errors: {}, username: '', email: '' });
});

// Render login form
router.get('/login', (req, res) => {
    res.render('login', { errors: {}, email: '', password: '' });
});

// Render dashboard
router.get('/dashboard', authenticateJWT, (req, res) => {
    if (!req.user) {
        // User is not found, possibly deleted from the database
        return res.redirect('/auth/login');
    }
    res.render('dashboard');
});

// Google authentication routes
router.get("/google", passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get(
    "/google/callback",
    passport.authenticate("google", { 
        failureRedirect: "/auth/login"
    }),
    (req, res) => {
        const token = jwt.sign({ id: req.user.id, email: req.user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('jwt', token); // If using cookies
        res.redirect(process.env.CLIENT_URL);
    }
);

// Logout Route
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).send('Could not log out.');
        }
        res.cookie('jwt', '', { maxAge: 1, httpOnly: true, path: '/' });
        res.redirect('/'); // Redirect to home or login page
    });
});

// Signup Route
router.post('/signup', (req, res) => {
    const { username, email, password } = req.body;
    let errors = {};

    // Validate required fields
    if (!username) {
        errors.username = 'Username is required.';
    }
    if (!email) {
        errors.email = 'Email is required.';
    }
    if (!password) {
        errors.password = 'Password is required.';
    }

    // If there are validation errors, render the signup form again with errors
    if (Object.keys(errors).length > 0) {
        return res.render('login', { errors, username, email });
    }

    // Check for duplicate username or email
    const checkSql = 'SELECT * FROM users WHERE username = ? OR email = ?';
    db.query(checkSql, [username, email], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Server error: ' + err.message);
        }
        if (result.length > 0) {
            // Handle duplicate entries
            result.forEach(user => {
                if (user.username === username) {
                    errors.username = 'Username already taken.';
                }
                if (user.email === email) {
                    errors.email = 'Email is already registered.';
                }
            });
            return res.render('login', { errors, username, email });
        }

        // Hash the password
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                console.error('Hashing error:', err);
                return res.status(500).send('Server error: ' + err.message);
            }

            // Insert the user into the database
            const sql = 'INSERT INTO users (username, email, password, provider) VALUES (?, ?, ?, ?)';
            db.query(sql, [username, email, hash, 'local'], (err, result) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).send('Server error: ' + err.message);
                }
                res.redirect('/auth/login');
            });
        });
    });
});

// Login Route
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    let errors = {};

    // Validate required fields
    if (!email) {
        errors.email = 'Email is required.';
    }
    if (!password) {
        errors.password = 'Enter a password.';
    }

    // If there are validation errors, render the login form again with errors
    if (Object.keys(errors).length > 0) {
        return res.render('login', { errors, email, password });
    }

    // Check if the user exists
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Server error.');
        }

        if (result.length === 0) {
            errors.email = 'User not found.';
            return res.render('login', { errors, email, password });
        }

        // Compare passwords
        const user = result[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Password comparison error:', err);
                return res.status(500).send('Server error.');
            }

            if (isMatch) {
                // Create a JWT
                const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.cookie('jwt', token); // If using cookies
                res.redirect('/auth/dashboard');
            } else {
                errors.password = 'Incorrect password.';
                return res.render('login', { errors, email, password });
            }
        });
    });
});

module.exports = router;
