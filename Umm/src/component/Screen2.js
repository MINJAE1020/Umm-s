import React, { useEffect, useState } from "react";
import axios from "axios";
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
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        const email = "user@example.com"; // replace with the actual email

        axios
            .get(`http://localhost:3001/userlocation?email=${email}`)
            .then((response) => {
                console.log("사용자 위치 데이터:", response.data);
                setUserLocation(response.data.location);
            })
            .catch((error) => {
                console.error("사용자 위치를 가져오는 중 에러 발생:", error);
            });

        axios
            .get("http://localhost:3001/locations")
            .then((response) => {
                console.log("장소 데이터:", response.data);
                setLocations(response.data);
            })
            .catch((error) => {
                console.error("장소 데이터를 가져오는 중 에러 발생:", error);
            });
    }, []);

    useEffect(() => {
        const script = document.createElement("script");
        script.src =
            "//dapi.kakao.com/v2/maps/sdk.js?appkey=8dc57e5937a2a6644c966d7cda41aebc&libraries=services";
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            if (window.kakao && window.kakao.maps) {
                initializeMap();
            } else {
                console.error("카카오 지도 API를 로드할 수 없습니다.");
            }
        };

        return () => {
            document.head.removeChild(script);
        };
    }, [userLocation, locations]);

    const initializeMap = () => {
        const infowindow = new window.kakao.maps.InfoWindow({
            zIndex: 1,
        });

        const mapContainer = document.getElementById("map");
        const mapOption = {
            center: new window.kakao.maps.LatLng(36.1460625, 128.3934375),
            level: 3,
        };

        const map = new window.kakao.maps.Map(mapContainer, mapOption);

        if (userLocation) {
            const ps = new window.kakao.maps.services.Places();
            ps.keywordSearch(userLocation, (data, status) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    const bounds = new window.kakao.maps.LatLngBounds();
                    data.forEach((place) => {
                        displayMarker(map, infowindow, place);
                        bounds.extend(
                            new window.kakao.maps.LatLng(place.y, place.x)
                        );
                    });
                    map.setBounds(bounds);
                } else {
                    console.error("사용자 위치 검색 실패:", status);
                }
            });
        }

        locations.forEach((location) => {
            const marker = new window.kakao.maps.Marker({
                map: map,
                position: new window.kakao.maps.LatLng(
                    location.latitude,
                    location.longitude
                ),
                title: location.locationName,
            });

            window.kakao.maps.event.addListener(marker, "click", () => {
                infowindow.setContent(
                    '<div style="padding:5px;font-size:12px;">' +
                        location.locationName +
                        "</div>"
                );
                infowindow.open(map, marker);
            });
        });
    };

    const displayMarker = (map, infowindow, place) => {
        const marker = new window.kakao.maps.Marker({
            map: map,
            position: new window.kakao.maps.LatLng(place.y, place.x),
        });

        window.kakao.maps.event.addListener(marker, "click", () => {
            infowindow.setContent(
                '<div style="padding:5px;font-size:12px;">' +
                    place.place_name +
                    "</div>"
            );
            infowindow.open(map, marker);
        });
    };

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
                <div id="map" style={styles.mapContent}></div>
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
