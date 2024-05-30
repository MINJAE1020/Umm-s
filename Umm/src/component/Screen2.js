import React, { useEffect } from "react";
import imgTrash from "../img/trashbag.png";

const screen = {
    display: "flex",
    justifyContent: "space-between",
};

const mapContainer = {
    width: "50%",
    border: "1px solid black",
    display: "flex",
    flexDirection: "column",
};

const locateContent = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    margin: "2%",
};

const locateBar = {
    border: "1px solid black",
    borderRadius: "5px",
    width: "80%",
    boxSizing: "content-box",
    margin: "2%",
};

const mapContent = {
    width: "90%",
    height: "90%",
    border: "5px solid rgb(30, 187, 72)",
    margin: "2%",
    borderRadius: "5px",
};

// -----------------------------------------

const dataContainer = {
    width: "45%",
    border: "1px solid black",
};

const barList = {
    listStyleType: "none",
    padding: "0",
    display: "flex",
    justifyContent: "center",
};

const barItem = {
    marginBottom: "10px",
    backgroundColor: "rgb(30, 187, 72)",
    width: "70%",
    height: "3rem",
    borderRadius: "5px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
};

const select = {
    width: "30%",
    marginBottom: "10px",
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    backgroundColor: "#fff",
    margin: "2%",
};

const imgicon = {
    height: "40px",
    width: "40px",
};

const pstyle = {
    fontWeight: "bold",
    marginLeft: "5%",
    marginRight: "5%",
};

function Screen2() {
    useEffect(() => {
        const script = document.createElement("script");
        script.src =
            "//dapi.kakao.com/v2/maps/sdk.js?appkey=8dc57e5937a2a6644c966d7cda41aebc&libraries=services";
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            if (window.kakao && window.kakao.maps) {
                const infowindow = new window.kakao.maps.InfoWindow({
                    zIndex: 1,
                });

                const mapContainer = document.getElementById("map"); // 지도를 표시할 div
                const mapOption = {
                    center: new window.kakao.maps.LatLng(
                        36.1460625,
                        128.3934375
                    ), // 지도의 중심좌표
                    level: 3, // 지도의 확대 레벨
                };

                const map = new window.kakao.maps.Map(mapContainer, mapOption);

                const ps = new window.kakao.maps.services.Places();

                const keyword = "동대구역";

                ps.keywordSearch(keyword, placesSearchCB);

                function placesSearchCB(data, status, pagination) {
                    if (status === window.kakao.maps.services.Status.OK) {
                        const bounds = new window.kakao.maps.LatLngBounds();

                        for (let i = 0; i < data.length; i++) {
                            displayMarker(data[i]);
                            bounds.extend(
                                new window.kakao.maps.LatLng(
                                    data[i].y,
                                    data[i].x
                                )
                            );
                        }

                        map.setBounds(bounds);
                    }
                }

                function displayMarker(place) {
                    const marker = new window.kakao.maps.Marker({
                        map: map,
                        position: new window.kakao.maps.LatLng(
                            place.y,
                            place.x
                        ),
                    });

                    window.kakao.maps.event.addListener(
                        marker,
                        "click",
                        function () {
                            infowindow.setContent(
                                '<div style="padding:5px;font-size:12px;">' +
                                    place.place_name +
                                    "</div>"
                            );
                            infowindow.open(map, marker);
                        }
                    );
                }
            } else {
                console.error("카카오 지도 API를 로드할 수 없습니다.");
            }
        };
    }, []);

    return (
        <div className="screen" style={screen}>
            <div className="map-container" style={mapContainer}>
                <div>
                    <label style={locateContent}>
                        내위치:
                        <div style={locateBar}>
                            <p>인천광역시 서구 검단동</p>
                        </div>
                    </label>
                </div>
                <div id="map" style={mapContent}></div>
            </div>

            {/* Right section with data from Excel */}
            <div className="data-container" style={dataContainer}>
                {/* Select element for choosing the type of list */}
                <select style={select}>
                    <option value="type1">수거 용기</option>
                    <option value="type2">전용 봉투</option>
                    {/* Add more options as needed */}
                </select>

                {/* List of bar-shaped data */}
                <ul className="bar-list" style={barList}>
                    {/* Each list item represents a bar-shaped data */}
                    <li className="bar-item" style={barItem}>
                        <img
                            style={imgicon}
                            src={imgTrash}
                            alt="trash icon"
                        ></img>
                        <p style={pstyle}>전용봉투</p>
                        <p style={pstyle}>2L</p>
                        <p style={pstyle}>400</p>
                    </li>
                    {/* Add more list items as needed */}
                </ul>
            </div>
        </div>
    );
}

export default Screen2;
