const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const authRoutes = require('./routes/auth');  // Authentication routes
const path = require('path');
// const email = require('emailjs');
const session = require('express-session');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up session management
app.use(session({
    secret: 'your-secret-key', // Use a strong, unique secret key
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Set up Handlebars as the view engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
// Serve static files from /public
const publicDirectory = path.join(__dirname ,'./public');
app.use(express.static(publicDirectory));

// Use the auth routes
app.use('/auth', authRoutes);

// Home route to render an HBS template
app.get('/', (req, res) => {
    res.render('login', { title: 'Welcome to the Node.js MySQL App' });
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Could not log out.');
        }
        res.redirect('/'); // Redirect to login page after logout
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
app.get('/views/contact.hbs', (req, res) => {
    res.render('contact',{ title: 'contact' });
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
