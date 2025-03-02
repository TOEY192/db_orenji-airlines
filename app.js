// npm import mysql2 express core dotenv
const mysql = require('mysql2');
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3306;

// ใช้สำหรับการ LOGIN
// npm install bcrypt
const bcrypt = require('bcryptjs'); // ใช้ bcrypt สำหรับเข้ารหัสรหัสผ่าน
const bodyParser = require('body-parser');

app.use(bodyParser.json()); // ใช้ body-parser เพื่ออ่าน JSON จาก request

app.use(cors());

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

// Serve static files (HTML, CSS, JS, images)
app.use(express.static((__dirname)));

// Route สำหรับหน้าแรก
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


app.get("/users", (req, res) => {
    connection.query("SELECT * FROM users", (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

// LOGIN API
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    console.log(username);
    console.log(password);
    // ตรวจสอบผู้ใช้จากฐานข้อมูล
    connection.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }

        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const user = results[0];

        // ตรวจสอบรหัสผ่านจากการนำค่าที่ป้อนเข้ามาแล้วนำไป hash แล้วค่อยไปเช็คใน database ว่าตรงไหม
        bcrypt.compare(password, user.password, (err, match) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (match) {
                // รหัสผ่านถูกต้อง
                res.json({ message: "Login successful", username: user.username, user: user });
            } else {
                // รหัสผ่านไม่ถูกต้อง
                res.status(401).json({ message: "Invalid email or password" });
            }
        });
    });
})

// REGISTER API
app.post("/register", (req, res) => {
    const { username, email, password } = req.body;

    // เข้ารหัสรหัสผ่านและบันทึกลงในฐานข้อมูล
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.log('Error hashing password:', err);
            return res.status(500).send({ error: 'Error hashing password' });
        }

        connection.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, hashedPassword], (err, results) => {
            if (err) {
                console.log('Register failed:', err);
                return res.status(500).send({ error: 'Failed to register user' });
            }
            res.json({
                message: "User registered successfully",
            });
        });
    });
});


app.post('/edit-info', authenticateToken, (req, res) => {
    const { first_name, last_name, passport_number } = req.body;
    const username = req.user.username;

    const sql = 'UPDATE users SET firstName = ?, lastName = ?, passportNumber = ? WHERE username = ?';
    connection.query(sql, [first_name, last_name, passport_number, username], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({ message: 'User info updated successfully' ,
            username: username
        });
    });
});


//ขั้นตอน booking เลือกว่าจะไปไหน แล้วเลือกจำนวนคน แล้วเลือกเที่ยวบิน และเลือกชั้น และราคาจะแสดออกมา
app.post('/booking', (req, res) => {
    const { user_id, flight_id, child, adult, total_price } = req.body
    const sql = 'INSERT INTO Bookings (user_id, flight_id, child, adult, total_price, status) VALUE (?, ?, ?, ?, ?, ?)';
    const status = "Booked"
    connection.query(sql, [user_id, flight_id, child, adult, total_price, status], (err, results) => {
        if (err) {
            return res.status(500).send(err)
        }
        res.json({ message: "Booked success" })
    })
})

    .get('/show-airline', (req, res) => {
        const { airport_code } = req.body; //จะได้มาเป็น airport-code
    })