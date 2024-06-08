// Screen2.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import KakaoMap from "./KakaoMap.js";
import imgTrash from "../img/trashbag.png";
import {
    Container,
    Select,
    MenuItem,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
} from "@mui/material";

const regions = [
    "서울특별시",
    "부산광역시",
    "대구광역시",
    "울산광역시",
    "광주광역시",
    "대전광역시",
];
const categories = ["전용봉투", "전용용기"];

const styles = {
    screen: {
        display: "flex",
        justifyContent: "space-between",
    },
    mapContainer: {
        width: "50%",
        border: "1px solid black",
        display: "flex",
        flexDirection: "column",
    },
    locateContent: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        // margin: "2%",
    },
    locateBar: {
        border: "1px solid black",
        borderRadius: "5px",
        width: "80%",
        boxSizing: "content-box",
        margin: "2%",
    },
    mapContent: {
        width: "90%",
        height: "90%",
        border: "5px solid rgb(30, 187, 72)",
        margin: "2%",
        borderRadius: "5px",
    },
    dataContainer: {
        width: "90%",
        border: "1px solid black",
        marginRight: "50px",
    },
    barList: {
        listStyleType: "none",
        padding: "0",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
    },
    barItem: {
        marginBottom: "10px",
        backgroundColor: "rgb(30, 187, 72)",
        width: "70%",
        height: "3rem",
        borderRadius: "5px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    select: {
        width: "30%",
        marginBottom: "10px",
        padding: "8px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        backgroundColor: "#fff",
        margin: "2%",
    },
    imgIcon: {
        height: "40px",
        width: "40px",
    },
    pStyle: {
        fontWeight: "bold",
        marginLeft: "5%",
        marginRight: "5%",
    },
};

function Screen2() {
    const [userLocation, setUserLocation] = useState("");
    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:3001/data", {
                params: {
                    region: selectedRegion,
                    category: selectedCategory,
                },
            });
            setData(response.data);
        } catch (error) {
            console.error("There was an error fetching the data!", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (selectedRegion && selectedCategory) {
            fetchData();
        }
    }, [selectedRegion, selectedCategory]);

    const columns = [
        "품목",
        "유형",
        "1L",
        "2L",
        "3L",
        "5L",
        "6L",
        "10L",
        "15L",
        "20L",
    ];

    return (
        <div className="screen" style={styles.screen}>
            <div className="map-container" style={styles.mapContainer}>
                <div>
                    <label style={styles.locateContent}>
                        내위치:
                        <div style={styles.locateBar}>
                            <p>{userLocation || "로딩 중..."}</p>
                        </div>
                    </label>
                </div>
                <KakaoMap userLocation={userLocation} />
            </div>

            <div className="data-container" style={styles.dataContainer}>
                {/* <select style={styles.select}>
                    <option value="type1">수거 용기</option>
                    <option value="type2">전용 봉투</option>
                </select>

                <ul className="bar-list" style={styles.barList}>
                    <li className="bar-item" style={styles.barItem}>
                        <img
                            style={styles.imgIcon}
                            src={imgTrash}
                            alt="trash icon"
                        ></img>
                        <p style={styles.pStyle}>전용봉투</p>
                        <p style={styles.pStyle}>2L</p>
                        <p style={styles.pStyle}>400</p>
                    </li>
                </ul> */}
                <Container>
                    <div style={{ marginBottom: "20px" }}>
                        <Select
                            value={selectedRegion}
                            onChange={(e) => setSelectedRegion(e.target.value)}
                            displayEmpty
                            style={{ marginRight: "10px" }}
                        >
                            <MenuItem value="">Select Region</MenuItem>
                            {regions.map((region) => (
                                <MenuItem key={region} value={region}>
                                    {region}
                                </MenuItem>
                            ))}
                        </Select>
                        <Select
                            value={selectedCategory}
                            onChange={(e) =>
                                setSelectedCategory(e.target.value)
                            }
                            displayEmpty
                            style={{ marginRight: "10px" }}
                        >
                            <MenuItem value="">Select Category</MenuItem>
                            {categories.map((category) => (
                                <MenuItem key={category} value={category}>
                                    {category}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                    {loading ? (
                        <CircularProgress />
                    ) : (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {columns.map((key) => (
                                            <TableCell key={key}>
                                                {key}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.map((row, index) => (
                                        <TableRow key={index}>
                                            {columns.map((col, i) => (
                                                <TableCell key={i}>
                                                    {row[col]}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Container>
            </div>
        </div>
    );
}

export default Screen2;
