const express = require("express");
const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");
const cors = require("cors");
const cron = require("cron");
const axios = require("axios");
const app = express();
const port = 3001;
require("dotenv").config();

app.use(express.json());
app.use(cors());

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "grabage",
    port: 3306,
});

app.post("/signup", async (req, res) => {
    const { email, PW, userLocation, myTool } = req.body;

    try {
        const [rows] = await db.query("SELECT * FROM user WHERE email = ?", [
            email,
        ]);
        if (rows.length > 0) {
            return res.status(409).json({ message: "중복된 이메일입니다." });
        }

        await db.query(
            "INSERT INTO user (email, PW, userLocation, myTool) VALUES (?, ?, ?, ?)",
            [email, PW, userLocation, myTool]
        );
        return res.status(201).json({ message: "회원가입 성공" });
    } catch (error) {
        console.error("Error signing up:", error);
        return res.status(500).json({ message: "Error signing up" });
    }
});

app.post("/login", async (req, res) => {
    const { email, PW } = req.body;

    try {
        const [rows] = await db.query(
            "SELECT * FROM user WHERE email = ? AND PW = ?",
            [email, PW]
        );
        if (rows.length > 0) {
            return res
                .status(200)
                .json({ message: "로그인 성공", email: email });
        } else {
            return res.status(401).json({ message: "로그인 실패" });
        }
    } catch (error) {
        console.error("Error logging in:", error);
        return res.status(500).json({ message: "Error logging in" });
    }
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

app.post("/search", async (req, res) => {
    console.log("Received request:", req.body);
    const { region, district, dong } = req.body;
    const query = `SELECT * FROM howtodispose WHERE region = ? AND district = ? AND dong = ?`;

    try {
        const [rows] = await db.query(query, [region, district, dong]);
        if (rows.length === 0) {
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
            } = rows[0];
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
    } catch (error) {
        console.error("Error fetching data from database:", error);
        res.status(500).send("Server Error");
    }
});

app.post("/add-alarm", async (req, res) => {
    const { userEmail, day, hour, minute } = req.body;

    try {
        const sql =
            "INSERT INTO alarm (userEmail, day, hour, minute) VALUES (?, ?, ?, ?)";
        await db.query(sql, [userEmail, day, hour, minute]);
        return res.status(200).json({ message: "알람이 추가되었습니다." });
    } catch (err) {
        console.error("Error adding alarm to database:", err);
        return res
            .status(500)
            .json({ message: "Error adding alarm to database" });
    }
});

app.get("/alarms", async (req, res) => {
    const { userEmail } = req.query;

    try {
        const sql = "SELECT day, hour, minute FROM alarm WHERE userEmail = ?";
        const [results] = await db.query(sql, [userEmail]);
        return res.status(200).json(results);
    } catch (err) {
        console.error("Error fetching alarms from database:", err);
        return res
            .status(500)
            .json({ message: "Error fetching alarms from database" });
    }
});

app.post("/remove-alarm", async (req, res) => {
    const { userEmail, day, hour, minute } = req.body;

    try {
        const sql =
            "DELETE FROM alarm WHERE userEmail = ? AND day = ? AND hour = ? AND minute = ?";
        await db.query(sql, [userEmail, day, hour, minute]);
        return res.status(200).json({ message: "알람이 삭제되었습니다." });
    } catch (err) {
        console.error("Error removing alarm from database:", err);
        return res
            .status(500)
            .json({ message: "Error removing alarm from database" });
    }
});

const toolfilePath = path.join(
    __dirname,
    "tooldata/음식물류 폐기물 종량제 물품 판매현황(종합).xlsx"
);
const workbook = xlsx.readFile(toolfilePath);
const sheet_name_list = workbook.SheetNames;
const sheet = workbook.Sheets[sheet_name_list[0]];
let jsonData = xlsx.utils.sheet_to_json(sheet);

const columns = [
    "시·도별",
    "구분",
    "품목",
    "유형",
    "1L",
    "1.5L",
    "2L",
    "2.5L",
    "3L",
    "4L",
    "5L",
    "6L",
    "7L",
    "10L",
    "15L",
    "20L",
];
jsonData = jsonData.map((row) => {
    let filteredRow = {};
    columns.forEach((col) => {
        filteredRow[col] = row[col];
    });
    return filteredRow;
});

app.get("/data", (req, res) => {
    const { region, category } = req.query;
    const filteredData = jsonData.filter(
        (item) => item["시·도별"] === region && item["구분"] === category
    );
    res.json(filteredData);
});

const apiKey =
    "T+RNMX1UL/650HYznYbTkx5bYAvuEtsGmWjHi46McZOR3fmjqMtnnDhR4fclFbcWHAsut2IeXs3km36gkBjRIQ==";

const fetchAndStoreData = async () => {
    try {
        const response = await axios.get(
            "https://api.odcloud.kr/api/15125354/v1/uddi:723a3307-ad9b-4bee-9854-a26fe7486908",
            {
                params: {
                    page: 1,
                    perPage: 1000000,
                    returnType: "JSON",
                    serviceKey: apiKey,
                },
            }
        );

        const data = response.data.data;
        const cities = [
            "서울특별시",
            "부산광역시",
            "대구광역시",
            "인천광역시",
            "광주광역시",
            "대전광역시",
            "울산광역시",
        ];

        for (const entry of data) {
            if (cities.includes(entry.지역1)) {
                const tableName = entry.지역1
                    .replace(/광역시|특별시/g, "")
                    .toLowerCase();

                const insertQuery = `
          INSERT INTO ${tableName} (지역1, 지역2, 지역3, 기간1, 기간2, 가구평균배출량) 
          VALUES (?, ?, ?, ?, ?, ?)
        `;
                const insertParams = [
                    entry.지역1,
                    entry.지역2,
                    entry.지역3,
                    entry.기간1,
                    entry.기간2,
                    entry.가구평균배출량,
                ];

                try {
                    await db.query(insertQuery, insertParams);
                } catch (error) {
                    if (error.code === "ER_DUP_ENTRY") {
                        console.log(
                            `Duplicate entry for 가구평균배출량: ${insertParams[5]}`
                        );
                    } else {
                        throw error;
                    }
                }
            }
        }
        console.log("Data fetched and stored successfully");
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

fetchAndStoreData();

app.get("/average-waste", async (req, res) => {
    const { city } = req.query;
    const tableName = city.replace(/광역시|특별시/g, "").toLowerCase();

    try {
        const [results] = await db.query(`SELECT * FROM ${tableName}`);

        const data = results.map((row) => {
            let location;
            if (!row.지역2) {
                location = row.지역3;
            } else if (!row.지역3) {
                location = row.지역2;
            }
            return { 지역: location, 가구평균배출량: row.가구평균배출량 };
        });

        if (data.length > 0) {
            res.json(data); // 배열로 전송
        } else {
            res.status(404).send("Data not found");
        }
    } catch (err) {
        console.error("Error executing query", err);
        res.status(500).send("Server error");
    }
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
