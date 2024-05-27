const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "grabage",
    port: 3306,
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err);
        return;
    }
    console.log("Connected to the database.");
});

app.post("/login", (req, res) => {
    const sql = "SELECT * FROM login WHERE username = ? AND password = ?";
    const { username, password } = req.body;

    db.query(sql, [username, password], (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Error" });
        }
        if (data.length > 0) {
            return res.status(200).json({ message: "로그인 성공" });
        } else {
            return res.status(401).json({ message: "로그인 실패" });
        }
    });
});

app.listen(8081, () => {
    console.log("Server is running on port 8081.");
});
