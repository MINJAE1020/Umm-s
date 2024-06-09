import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const signup_form = {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
};

const inputContainerStyle = {
    width: "700px", // Adjusted width to fill the form width
    margin: "10px auto", // Centering div horizontally
    height: "100px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const inputStyle = {
    width: "100%", // Adjusted width to fill the input container width
    height: "60px",
    padding: "10px",
    display: "block",
};

const buttonStyle = {
    width: "150px", // Set button width to 150px
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    margin: "10px 0",
    alignItems: "center",
    justifyContent: "center",
};

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [PW, setPassword] = useState("");
    const [userLocation, setUserLocation] = useState("");
    const [myTool, setMyTool] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:3001/signup", {
                email,
                PW,
                userLocation,
                myTool,
            });
            console.log(response.data);
            if (response.data.message === "회원가입 성공") {
                alert("회원가입 성공");
                navigate("/"); // 회원가입 성공 시 로그인 페이지로 이동
            } else {
                alert("회원가입 실패: " + response.data.message);
            }
        } catch (error) {
            console.error(error);
            alert("회원가입 실패");
        }
    };

    return (
        <div style={signup_form}>
            <div className="nav">
                <h1>Umm's</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <div style={inputContainerStyle}>
                    <input
                        type="text"
                        placeholder="ID"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={inputStyle}
                    />
                </div>
                <div style={inputContainerStyle}>
                    <input
                        type="password"
                        placeholder="password"
                        value={PW}
                        onChange={(e) => setPassword(e.target.value)}
                        style={inputStyle}
                    />
                </div>
                <div style={inputContainerStyle}>
                    <input
                        type="text"
                        placeholder="location"
                        value={userLocation}
                        onChange={(e) => setUserLocation(e.target.value)}
                        style={inputStyle}
                    />
                </div>
                <div style={inputContainerStyle}>
                    <input
                        type="text"
                        placeholder="Tool"
                        value={myTool}
                        onChange={(e) => setMyTool(e.target.value)}
                        style={inputStyle}
                    />
                </div>
                <div style={inputContainerStyle}>
                    <button type="submit" style={buttonStyle}>
                        sign_up
                    </button>
                </div>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default SignUp;
