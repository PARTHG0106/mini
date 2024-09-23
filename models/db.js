const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'sql303.infinityfree.com',
    user: 'if0_37369387',
    password: 'BxSTD05kZoo5u',  // Set your MySQL password here
    database: 'if0_37369387_empowerher'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to MySQL.');
    }
});

module.exports = db;
