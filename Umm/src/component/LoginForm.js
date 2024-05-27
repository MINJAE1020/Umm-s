import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import imgUrl from "../img/character1.png";

const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:3000/login", {
                username,
                password,
            });
            console.log(response.data);
            if (response.data.message === "로그인 성공") {
                alert("로그인 성공");
                navigate("/home");
            } else {
                // 로그인 실패 시의 처리
                alert("로그인 실패: " + response.data.message);
            }
        } catch (error) {
            console.error(error);
            alert("로그인 실패");
        }
    };

    return (
        <div className="login-display">
            <div className="nav">
                <h1>Umm's</h1>
            </div>

            <div className="main-content">
                <div className="img-content">
                    <img src={imgUrl} alt="캐릭터이미지"></img>
                </div>
                <div className="login-Content">
                    <form className="login-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="ID"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit">Login</button>
                    </form>
                    <p className="message">Not registered? </p>
                </div>
            </div>
            {message && <p>{message}</p>}
        </div>
    );
};

export default LoginForm;
