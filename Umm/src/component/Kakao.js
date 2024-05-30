import React, { useEffect } from "react";

const { kakao } = window;

function Kakao() {
    useEffect(() => {
        const container = document.getElementById("map");
        const options = {
            center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
            level: 1, // 지도의 확대 레벨
        };
        const map = new kakao.maps.Map(container, options);
    });

    return (
        <div
            id="map"
            style={{
                width: "500px",
                height: "500px",
            }}
        ></div>
    );
}

export default Kakao;
