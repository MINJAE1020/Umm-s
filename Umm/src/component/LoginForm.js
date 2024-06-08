import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import imgUrl from "../img/character1.png";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [PW, setPW] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:3001/login", {
                email,
                PW,
            });
            console.log(response.data);
            if (response.data.message === "로그인 성공") {
                alert("로그인 성공");
                localStorage.setItem("userEmail", email); // 이메일 저장
                navigate("/home");
            } else {
                alert("로그인 실패: " + response.data.message);
            }
        } catch (error) {
            console.error(error);
            alert("로그인 실패");
        }
    };

    const handleRegister = () => {
        // 회원가입 페이지로 이동하는 코드 작성
        navigate("/signup");
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
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={PW}
                            onChange={(e) => setPW(e.target.value)}
                        />
                        <button type="submit">sign_in</button>
                    </form>
                    <p className="message">
                        <button onClick={handleRegister}>sign_up</button>
                    </p>
                </div>
            </div>
            {message && <p>{message}</p>}
        </div>
    );
};

export default LoginForm;
