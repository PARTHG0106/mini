const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'sql12.freesqldatabase.com',
    user: 'sql12733084',
    password: '6RqEpGmVWg',  // Set your MySQL password here
    database: 'sql12733084'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to MySQL.');
    }
});

module.exports = db;
