const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'sql303.infinityfree.com',
    user: 'if0_37369387',
    password: 'Parthg@123',  // Set your MySQL password here
    database: 'nodetest'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to MySQL.');
    }
});

module.exports = db;
