const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./models/db'); // Ensure this path is correct

passport.serializeUser((user, done) => {
    done(null, user.id); // Storing only the user ID in session
});

passport.deserializeUser((id, done) => {
    db.query('SELECT * FROM users WHERE id = ?', [id], (err, result) => {
        if (err) {
            return done(err);
        }
        if (result.length > 0) {
            return done(null, result[0]); // This ensures the full user data is available (username, profilePic)
        } else {
            return done(null, false);
        }
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    const email = profile.emails[0].value;
    const googleId = profile.id;
    let username = profile.displayName; // Default username from Google
    const profilePic = profile.photos ? profile.photos[0].value : '/images/default-profile.png'; // Get profile picture or default if not available

    // Check if the user already exists in the database
    const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkUserQuery, [email], (err, result) => {
        if (err) {
            return done(err);
        }

        if (result.length > 0) {
            // User already exists, continue with login
            return done(null, result[0]); // Make sure the result has username and profilePic fields
        } else {
            // Check if the username already exists
            const checkUsernameQuery = 'SELECT * FROM users WHERE username = ?';
            db.query(checkUsernameQuery, [username], (err, userResult) => {
                if (err) {
                    return done(err);
                }

                if (userResult.length > 0) {
                    // Username exists, append a part of the Google ID to make it unique
                    username += googleId.substring(0, 5); // Append first 5 characters of Google ID
                }

                // Insert new user with unique username and profile picture
                const newUser = {
                    username: username,
                    email: email,
                    google_id: googleId,
                    provider: 'google',
                    profilePic: profilePic // Store the profile picture URL
                };

                const insertUserQuery = 'INSERT INTO users (username, email, google_id, provider, profilePic) VALUES (?, ?, ?, ?, ?)';
                db.query(insertUserQuery, [newUser.username, newUser.email, newUser.google_id, newUser.provider, newUser.profilePic], (err, insertResult) => {
                    if (err) {
                        return done(err);
                    }

                    newUser.id = insertResult.insertId;
                    return done(null, newUser); // Ensure that newUser is passed here
                });
            });
        }
    });
}));


module.exports = passport;
