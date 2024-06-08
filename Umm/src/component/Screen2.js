// Screen2.js

import React, { useState } from "react";
import KakaoMap from "./KakaoMap.js";
import imgTrash from "../img/trashbag.png";

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
        margin: "2%",
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
        width: "45%",
        border: "1px solid black",
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
                <select style={styles.select}>
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
                </ul>
            </div>
        </div>
    );
}

export default Screen2;
