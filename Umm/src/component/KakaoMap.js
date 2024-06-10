import React, { useEffect } from "react";
import { Map, Marker } from "react-kakao-maps";

const KakaoMap = () => {
    useEffect(() => {
        const mapContainer = document.getElementById("map");
        const mapOption = {
            center: new window.kakao.maps.LatLng(36.1460625, 128.3934375),
            level: 3,
        };

        const map = new window.kakao.maps.Map(mapContainer, mapOption);
        const ps = new window.kakao.maps.services.Places();

        ps.keywordSearch("대구역 근처 마트", (data, status, pagination) => {
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
                            const infowindow = new window.kakao.maps.InfoWindow(
                                {
                                    zIndex: 1,
                                }
                            );
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
        });
    }, []);

    return <div id="map" style={{ width: "100%", height: "350px" }} />;
};

export default KakaoMap;
