const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'sql12.freesqldatabase.com',
    user: 'sql12731741',
    password: '6S1LUQIYad',  // Set your MySQL password here
    database: 'sql12731741'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to MySQL.');
    }
});

module.exports = db;
