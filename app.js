// npm import mysql2 express core dotenv
const mysql = require('mysql2');
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const moment = require('moment-timezone');

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

                const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });

                res.cookie("token", token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "Strict"
                });

                res.json({ message: "Login successful", token});
            } else {
                // รหัสผ่านไม่ถูกต้อง
                res.status(401).json({ message: "Invalid email or password" });
            }
        });
    });
})

const jwt = require('jsonwebtoken');

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

            // สร้าง JWT token
            const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });

            // ส่ง cookies ที่มี token
            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "Strict"
            });

            res.json({
                message: "User registered successfully",
                token: token
            });
        });
    });
});

app.get('/user-profile', authenticateToken, (req, res) => {
    const username = req.user.username;
    console.log("username is " , username)
    const sql = 'SELECT firstName, lastName, email, passportNumber FROM users WHERE username = ?';
    connection.query(sql, [username], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        console.log(results)
        res.json(results);
    })
})

function authenticateToken(req, res, next) {
    // รับ token จาก header 'Authorization'
    const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token.' });
        }

        req.user = user;
        next();
    });
}


app.post('/edit-info', authenticateToken, (req, res) => {
    const { first_name, last_name, passport_number } = req.body;
    const username = req.user.username;

    console.log(username)
    const sql = 'UPDATE users SET firstName = ?, lastName = ?, passportNumber = ? WHERE username = ?';
    connection.query(sql, [first_name, last_name, passport_number, username], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({
            message: 'User edit info successfully',
            username: username
        });
    });
});

app.post('/edit-fname', authenticateToken, async (req, res) => {
    const username = req.user.username;
    const { fname } = req.body;
    const sql = 'UPDATE users SET firstName = ? WHERE username = ?'
    const updateFname = await connection.promise().query(sql, [fname, username])
    res.json(updateFname)
})

app.post('/edit-lname', authenticateToken, async (req, res) => {
    const username = req.user.username;
    const { lname } = req.body;
    const sql = 'UPDATE users SET lastName = ? WHERE username = ?'
    const updateFname = await connection.promise().query(sql, [lname, username])
    res.json(updateFname)
})

app.post('/edit-email', authenticateToken, async (req, res) => {
    const username = req.user.username;
    const { email } = req.body;
    const sql = 'UPDATE users SET email = ? WHERE username = ?'
    const updateFname = await connection.promise().query(sql, [email, username])
    res.json(updateFname)
})

app.post('/edit-profile', authenticateToken, async (req, res) => {
    const { table } = req.query;
    const { info } = req.body
    const username = req.user.username;
    console.log(table)

    // const sql = 'UPDATE users SET ? = ? WHERE username = ?'
    // const update = await connection.promise().query(sql, [table, info, username])
    res.json(update)
})


///////////////////////////
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

app.get('/show-airports', (req, res) => {
    const sql = 'SELECT * FROM Airports'
    connection.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    })
})

app.get("/search", (req, res) => {
    let searchQuery = req.query.q;
    console.log(searchQuery);
    let sql = "SELECT * FROM Airports WHERE name LIKE ? LIMIT 10"; // จำกัดผลลัพธ์
    connection.query(sql, [`%${searchQuery}%`], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});

app.get('/show-flight', async (req, res) => {
    try {
        // รับค่าจาก Query String
        const { departure_airport_name, arrival_airport_name, date } = req.query; 
        const departure_time_f = date + " 00:00:00"
        const departure_time_l = date + " 23:59:59"

        // ดึง airport_id จากชื่อสนามบิน
        const sql = 'SELECT airport_id FROM Airports WHERE name = ?';
        
        console.log("output: ", departure_airport_name, arrival_airport_name)
        const [departureResult] = await connection.promise().query(sql, [decodeURIComponent(departure_airport_name)]);
        const [arrivalResult] = await connection.promise().query(sql, [decodeURIComponent(arrival_airport_name)]);
        console.log("output: ", departureResult, arrivalResult)
        // ตรวจสอบว่าเจอสนามบินหรือไม่
        if (departureResult.length === 0 || arrivalResult.length === 0) {
            return res.status(404).json({ error: "สนามบินไม่พบ" });
        }
        
        const departureId = departureResult[0].airport_id;
        const arrivalId = arrivalResult[0].airport_id;

        console.log("output: ", departureId, arrivalId)
        // ค้นหาเที่ยวบิน
        const flightSql = 'SELECT flight_code, departure_time, arrival_time FROM Flights WHERE departure_airport_id = ? AND arrival_airport_id = ? AND departure_time >= ? AND departure_time < ?';
        const [flights] = await connection.promise().query(flightSql, [departureId, arrivalId, departure_time_f, departure_time_l]);

        res.json(flights); // ส่งผลลัพธ์กลับไป
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
    }
});

app.get('/update-flight', async (req, res) => {
    const currentTime = moment().tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss');
    const sql = 'SELECT flight_id, flight_code, departure_time, arrival_time FROM Flights WHERE arrival_time <= ?';
    const [flights] = await connection.promise().query(sql, [currentTime])
    flights.forEach(async flight => {
        const newDepartureTime = moment(flight.departure_time).add(2, 'weeks').format('YYYY-MM-DD HH:mm:ss');
        const newArrivalTime = moment(flight.arrival_time).add(2, 'weeks').format('YYYY-MM-DD HH:mm:ss');
        const sqlUpdate = 'UPDATE Flights SET departure_time = ?, arrival_time = ? WHERE flight_code = ?'
        const newUpdate = await connection.promise().query(sqlUpdate, [newDepartureTime, newArrivalTime, flight.flight_code])
        const sqlUpdateSeat = 'UPDATE Seats SET status = "Available" WHERE flight_id = ?'
        const updateSeat = await connection.promise().query(sqlUpdateSeat, [flight.flight_id])
    })
    res.json({msg: "update success"})
})

///////////////////////////
app.get('/seats', async (req, res) => {
    const { flight } = req.query
    const [flight_id] = await connection.promise().query('SELECT flight_id FROM Flights WHERE flight_code = ?', [flight])
    const sql = 'SELECT seat_number, status FROM Seats WHERE flight_id = ?'
    const [results] = await connection.promise().query(sql, [flight_id[0].flight_id])
    res.json(results)
})