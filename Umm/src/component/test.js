const express = require("express");
const mysql = require("mysql2");
const fs = require("fs"); //
const path = require("path"); //
const xlsx = require("xlsx"); //
const cors = require("cors");
const cron = require("cron"); // cron 추가
const app = express();
const port = 3000;
require("dotenv").config(); // 환경 변수 로드

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "1234",
    database: process.env.DB_NAME || "mydatabase",
});

db.connect((err) => {
    if (err) {
        console.error("MySQL connection error:", err);
        process.exit(1);
    }
    console.log("MySQL connected...");
});

// 파일 경로
const directoryPath = path.join(__dirname, "data");
const logFilePath = path.join(__dirname, "processed.log");

// 처리된 파일을 기록하는 로그 파일 초기화
if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, "");
}

// 로그 파일에서 처리된 파일 목록을 읽기
const processedFiles = fs
    .readFileSync(logFilePath, "utf8")
    .split("\n")
    .filter(Boolean);

// 엑셀 파일을 읽어서 데이터베이스에 저장하는 함수
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

                // 데이터베이스에 저장할 형식으로 데이터 가공
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

                // 데이터베이스에 데이터 삽입
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

// 크론 작업 설정: 매일 자정에 processDataOnce 함수 실행
const job = new cron.CronJob("0 0 * * *", processDataOnce); // 매일 자정에 실행
job.start();

// 서버 시작 시 데이터 처리 함수 실행
processDataOnce();

// 클라이언트로부터 위치 정보를 받아와 해당 정보를 데이터베이스에서 조회하여 반환
app.post("/search", (req, res) => {
    console.log("Received request:", req.body);
    const { region, district, dong } = req.body;
    const query = `SELECT * FROM disposal_info WHERE region = ? AND district = ? AND dong = ?`;
    db.query(query, [region, district, dong], (err, results) => {
        if (err) {
            console.error("Error fetching data from database:", err);
            res.status(500).send("Server Error");
        } else {
            if (results.length === 0) {
                // 데이터가 없을 때 404 에러를 반환
                res.status(404).json({ error: "Data not found" });
            } else {
                // 데이터를 JSON 형식으로 클라이언트에게 반환
                const {
                    disposal_day,
                    non_collection_day,
                    disposal_location,
                    disposal_method,
                    disposal_time,
                    department_name,
                    department_phone,
                } = results[0];
                res.json({
                    disposal_day,
                    non_collection_day,
                    disposal_location,
                    disposal_method,
                    disposal_time,
                    department_name,
                    department_phone,
                });
            }
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
