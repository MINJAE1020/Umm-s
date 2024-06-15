import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Container,
    TextField,
    Select,
    MenuItem,
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

    useEffect(() => {
        const fetchUserData = async () => {
            const userEmail = localStorage.getItem("userEmail");
            if (!userEmail) {
                alert("로그인이 필요합니다.");
                return;
            }

            try {
                const response = await axios.post(
                    "http://localhost:3001/search-location",
                    { email: userEmail }
                );
                const userData = response.data;
                setUserLocation(userData.userLocation);
            } catch (error) {
                console.error(
                    "사용자 정보를 가져오는 중 오류가 발생했습니다.",
                    error
                );
            }
        };
        fetchUserData(); // useEffect 내부에서 직접 호출

        const mapContainer = document.getElementById("map");
        const mapOption = {
            center: new window.kakao.maps.LatLng(36.1460625, 128.3934375),
            level: 3,
        };

        const map = new window.kakao.maps.Map(mapContainer, mapOption);
        const ps = new window.kakao.maps.services.Places();

        ps.keywordSearch(
            userLocation + "근처 마트",
            (data, status, pagination) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    const bounds = new window.kakao.maps.LatLngBounds();

                    for (let i = 0; i < data.length; i++) {
                        const place = data[i];
                        const marker = new window.kakao.maps.Marker({
                            map: map,
                            position: new window.kakao.maps.LatLng(
                                place.y,
                                place.x
                            ),
                        });

                        bounds.extend(
                            new window.kakao.maps.LatLng(place.y, place.x)
                        );
                        window.kakao.maps.event.addListener(
                            marker,
                            "click",
                            function () {
                                const infowindow =
                                    new window.kakao.maps.InfoWindow({
                                        zIndex: 1,
                                    });
                                infowindow.setContent(
                                    '<div style="padding:5px;font-size:12px;">' +
                                        place.place_name +
                                        "</div>"
                                );
                                infowindow.open(map, marker);
                            }
                        );
                    }

                    map.setBounds(bounds);
                }
            }
        );
    }, [userLocation]);

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
            console.error("데이터를 가져오는 중 오류가 발생했습니다.", error);
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
                <div style={styles.locateContent}>
                    <TextField
                        label="사용자 주소"
                        variant="outlined"
                        margin="normal"
                        value={userLocation}
                        disabled
                        sx={{ width: 450, margin: "0 5px", height: 56 }}
                    />
                </div>
                <div id="map" style={{ width: "100%", height: "100%" }} />
            </div>
            <div className="data-container" style={styles.dataContainer}>
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
