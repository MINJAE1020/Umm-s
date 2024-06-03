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

    const dropTableQuery = "DROP TABLE IF EXISTS location";
    db.query(dropTableQuery, (err) => {
        if (err) {
            console.error("Error dropping location table:", err);
        } else {
            console.log("Location table dropped.");

            const createTableQuery = `
                CREATE TABLE location (
                    locationID INT AUTO_INCREMENT PRIMARY KEY,
                    locationName TEXT,
                    latitude DECIMAL(10, 7),
                    longitude DECIMAL(10, 7)
                )
            `;
            db.query(createTableQuery, (err) => {
                if (err) {
                    console.error("Error creating location table:", err);
                } else {
                    console.log("Location table created.");
                }
            });
        }
    });
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

function processMartsData() {
    console.log("Starting processMartsData...");
    const martsFilePath = path.join(directoryPath, "marts_data.xlsx");
    if (fs.existsSync(martsFilePath)) {
        const workbook = xlsx.readFile(martsFilePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);

        // Filter out rows with null or undefined locationName, latitude, or longitude
        const extractedData = data
            .map((row) => [
                row["locationName"],
                row["latitude"],
                row["longitude"],
            ])
            .filter((row) => row[0] && row[1] && row[2]);

        console.log("Filtered Data:", extractedData);

        if (extractedData.length > 0) {
            const query =
                "INSERT INTO location (locationName, latitude, longitude) VALUES ?";
            db.query(query, [extractedData], (err) => {
                if (err) {
                    console.error(
                        "Error inserting marts data into database:",
                        err
                    );
                } else {
                    console.log("Marts data inserted into database");
                }
            });
        } else {
            console.log("No valid data to insert.");
        }
    } else {
        console.log("marts_data.xlsx file does not exist.");
    }
}

const job = new cron.CronJob("0 0 * * *", () => {
    processDataOnce();
    processMartsData();
});

job.start();

processDataOnce();
processMartsData();

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

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
