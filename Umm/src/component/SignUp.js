import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
        <div className="signup-form">
            <h2>회원가입</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="이메일"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="비밀번호"
                    value={PW}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="지역"
                    value={userLocation}
                    onChange={(e) => setUserLocation(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="사용하는 도구"
                    value={myTool}
                    onChange={(e) => setMyTool(e.target.value)}
                />
                <button type="submit">회원가입</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default SignUp;
