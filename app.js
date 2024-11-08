const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const authRoute = require('./routes/auth');  // Authentication routes
const path = require('path');
// const email = require('emailjs');
const session = require('express-session');
const app = express();
const cookieParser = require('cookie-parser');
require("dotenv").config();
const cors = require("cors");
const passport = require("passport");
const cookieSession = require("cookie-session");
const passportStrategy = require("./passport");
app.use(cookieParser());
const jwt = require('jsonwebtoken');
const db = require('./models/db');

const authenticateJWT = (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.redirect('/auth/login');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send('Token is invalid');
        }
        req.user = user;
        next();
    });
};

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up session middleware
app.use(session({
    secret: 'your-secret-key', // Use a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 // 1 day (optional)
    }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(
	cors({
		origin: "http://localhost:3000",
		methods: "GET,POST,PUT,DELETE",
		credentials: true,
	})
);

// Set up Handlebars as the view engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
// Serve static files from /public
const publicDirectory = path.join(__dirname ,'./public');
app.use(express.static(publicDirectory));

// Use the auth routes
app.use('/auth', authRoute);

// Home route to render an HBS template
app.get('/', (req, res) => {
    res.render('login', { title: 'Welcome to the Node.js MySQL App' });
});

// Logout route
// Logout route in app.js
app.get('/auth/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Could not log out.');
        }
        res.clearCookie('jwt'); // Clear the JWT cookie
        res.redirect('/'); // Redirect to home page after logout
    });
});

app.get('/views/jobs.hbs', (req, res) => {
    res.render('jobs', { title: 'Jobs' });
})
app.get('/views/about.hbs', (req, res) => {
    res.render('about', { title: 'about' });
})
app.get('/views/dashboard.hbs', (req, res) => {
    res.render('dashboard', { title: 'dashboard' });
})
app.get('/views/profile.hbs', authenticateJWT, (req, res) => {
    // console.log('User data for profile page:', req.user);  // Debug user data
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    res.render('profile', { title: 'User Profile', user: req.user });
});

app.get('/views/contact.hbs', (req, res) => {
    res.render('contact',{ title: 'contact', user: req.user });
});
app.get('/contact', (req, res) => {
    if (req.user) {
        // Make sure user is logged in and `req.user` contains the user info
        res.render('contact', { user: req.user });
    } else {
        // Handle case where user is not logged in
        res.redirect('/login');
    }
});
app.post('/update-work-history', authenticateJWT, (req, res) => {
    console.log("Received work history data:", req.body); // Log the received data
    const userId = req.user.id;
    const workHistory = req.body.workHistory;

    if (!workHistory) {
        return res.status(400).json({ error: 'No work history data provided.' });
    }

    const query = 'UPDATE users SET workHistory = ? WHERE id = ?';
    db.query(query, [JSON.stringify(workHistory), userId], (err, result) => {
        if (err) {
            console.error('Error updating work history:', err);
            return res.status(500).json({ error: 'Error updating work history.' });
        }
        console.log('Work history updated successfully:', result);
        res.json({ message: 'Work history updated.' });
    });
});

app.post('/update-skills', authenticateJWT, (req, res) => {
    const userId = req.user.id;
    const skills = req.body.skills; // New skills from the client

    if (!skills) {
        return res.status(400).json({ error: 'No skills data provided.' });
    }

    const query = 'UPDATE users SET skills = ? WHERE id = ?';
    db.query(query, [JSON.stringify(skills), userId], (err, result) => {
        if (err) {
            console.error('Error updating skills:', err);
            return res.status(500).json({ error: 'Error updating skills.' });
        }
        res.json({ message: 'Skills updated.' });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});