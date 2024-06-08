// KaKaoMap.js

import { useEffect } from "react";

const KaKaoMap = ({ userLocation }) => {
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
    }, [userLocation]);

    const initializeMap = () => {
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
    };

    return <div id="map" style={{ width: "100%", height: "100%" }}></div>;
};

export default KaKaoMap;
