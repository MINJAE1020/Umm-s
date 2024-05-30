import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const container = document.getElementById("root");
if (container) {
    const root = ReactDOM.createRoot(container);
    root.render(<App />);
} else {
    console.error("루트 요소를 찾을 수 없습니다!");
}
