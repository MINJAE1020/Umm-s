const express = require("express");
const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");
const cors = require("cors");
const cron = require("cron");
const app = express();
const port = 3001;
require("dotenv").config();

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

app.post("/signup", (req, res) => {
    const { email, PW, userLocation, myTool } = req.body;

    // 이메일 중복 확인
    const checkDuplicateEmail = "SELECT * FROM user WHERE email = ?";
    db.query(checkDuplicateEmail, [email], (err, results) => {
        if (err) {
            console.error("Error checking duplicate email:", err);
            return res
                .status(500)
                .json({ message: "Error checking duplicate email" });
        }
        if (results.length > 0) {
            // 중복된 이메일이 이미 존재할 경우
            return res.status(409).json({ message: "중복된 이메일입니다." });
        } else {
            // 중복된 이메일이 없을 경우 새로운 회원 등록
            const insertUserQuery =
                "INSERT INTO user (email, PW, userLocation, myTool) VALUES (?, ?, ?, ?)";
            db.query(
                insertUserQuery,
                [email, PW, userLocation, myTool],
                (err) => {
                    if (err) {
                        console.error("Error signing up:", err);
                        return res
                            .status(500)
                            .json({ message: "Error signing up" });
                    }
                    return res.status(201).json({ message: "회원가입 성공" });
                }
            );
        }
    });
});

app.post("/login", (req, res) => {
    const sql = "SELECT * FROM user WHERE email = ? AND PW = ?";
    const { email, PW } = req.body;

    db.query(sql, [email, PW], (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Error" });
        }
        if (data.length > 0) {
            return res
                .status(200)
                .json({ message: "로그인 성공", email: email });
        } else {
            return res.status(401).json({ message: "로그인 실패" });
        }
    });
});

const directoryPath = path.join(__dirname, "data");
const logFilePath = path.join(__dirname, "processed.log");

if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, "");
}

const processedFiles = fs
    .readFileSync(logFilePath, "utf8")
    .split("\n")
    .filter(Boolean);

function processDataOnce() {
    console.log("Starting processDataOnce...");
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return console.log("Unable to scan directory:", err);
        }
        console.log("Files in directory:", files);
        files.forEach((file) => {
            if (
                path.extname(file) === ".xlsx" &&
                !processedFiles.includes(file)
            ) {
                console.log("Processing file:", file);
                const filePath = path.join(directoryPath, file);
                const workbook = xlsx.readFile(filePath);
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const data = xlsx.utils.sheet_to_json(worksheet);

                const extractedData = data.map((row) => [
                    row["시도명"],
                    row["시군구명"],
                    row["관리구역대상지역명"],
                    row["음식물쓰레기배출요일"],
                    row["미수거일"],
                    row["배출장소"],
                    row["음식물쓰레기배출방법"],
                    row["음식물쓰레기배출종료시각"],
                    row["관리부서명"],
                    row["관리부서전화번호"],
                ]);

                const query =
                    "INSERT INTO howtodispose (region, district, dong, disposalDay, nonCollectionDay, disposalLocation, disposalMethod, disposalTime, departmentName, departmentPhone) VALUES ?";
                db.query(query, [extractedData], (err) => {
                    if (err) {
                        console.error(
                            "Error inserting data into database:",
                            err
                        );
                    } else {
                        console.log("Data inserted into database");
                        fs.appendFileSync(logFilePath, `${file}\n`);
                    }
                });
            } else {
                console.log(
                    "Skipping file (already processed or not an .xlsx file):",
                    file
                );
            }
        });
    });
}

const job = new cron.CronJob("0 0 * * *", () => {
    processDataOnce();
});

job.start();

processDataOnce();

app.post("/search", (req, res) => {
    console.log("Received request:", req.body);
    const { region, district, dong } = req.body;
    const query = `SELECT * FROM howtodispose WHERE region = ? AND district = ? AND dong = ?`;
    db.query(query, [region, district, dong], (err, results) => {
        if (err) {
            console.error("Error fetching data from database:", err);
            res.status(500).send("Server Error");
        } else {
            if (results.length === 0) {
                res.status(404).json({ error: "Data not found" });
            } else {
                const {
                    disposalDay,
                    nonCollectionDay,
                    disposalLocation,
                    disposalMethod,
                    disposalTime,
                    departmentName,
                    departmentPhone,
                } = results[0];
                res.json({
                    disposalDay,
                    nonCollectionDay,
                    disposalLocation,
                    disposalMethod,
                    disposalTime,
                    departmentName,
                    departmentPhone,
                });
            }
        }
    });
});

app.post("/add-alarm", (req, res) => {
    const { userEmail, day, hour, minute } = req.body;

    const sql =
        "INSERT INTO alarm (userEmail, day, hour, minute) VALUES (?, ?, ?, ?)";
    db.query(sql, [userEmail, day, hour, minute], (err) => {
        if (err) {
            console.error("Error adding alarm to database:", err);
            return res
                .status(500)
                .json({ message: "Error adding alarm to database" });
        }
        return res.status(200).json({ message: "알람이 추가되었습니다." });
    });
});

// 새로운 엔드포인트 추가: 특정 사용자의 알람을 가져옴
app.get("/alarms", (req, res) => {
    const { userEmail } = req.query;

    const sql = "SELECT day, hour, minute FROM alarm WHERE userEmail = ?";
    db.query(sql, [userEmail], (err, results) => {
        if (err) {
            console.error("Error fetching alarms from database:", err);
            return res
                .status(500)
                .json({ message: "Error fetching alarms from database" });
        }
        console.log(results);

        // 데이터베이스에서 가져온 결과를 그대로 클라이언트에 반환
        return res.status(200).json(results);
    });
});

app.post("/remove-alarm", (req, res) => {
    const { userEmail, day, hour, minute } = req.body;

    const sql =
        "DELETE FROM alarm WHERE userEmail = ? AND day = ? AND hour = ? AND minute = ?";
    db.query(sql, [userEmail, day, hour, minute], (err) => {
        if (err) {
            console.error("Error removing alarm from database:", err);
            return res
                .status(500)
                .json({ message: "Error removing alarm from database" });
        }
        return res.status(200).json({ message: "알람이 삭제되었습니다." });
    });
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
