// npm import mysql2 express core dotenv
const mysql = require('mysql2');
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const app = express();

// สร้างการเชื่อมต่อกับ MySQL
const connection = mysql.createConnection(process.env.DATABASE_URL);

// เชื่อมต่อกับฐานข้อมูล
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log("Connected to MySQL!");
});

app.get('/', (req, res, next) => {
    res.json({msg: "test"})
})

app.listen(process.env.PORT || 3000);

app.get("/users", (req, res) => {
    connection.query("SELECT * FROM Users", (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});