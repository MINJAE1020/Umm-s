import axios from "axios";
import React, { useState } from "react";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8081/login", {
                username,
                password,
            });
            console.log(response.data);
            if (response.data.message === "로그인 성공") {
                // 로그인 성공 시의 처리
                setMessage("로그인 성공");
                alert("로그인 성공");
            } else {
                // 로그인 실패 시의 처리
                setMessage("로그인 실패: " + response.data.message);
                alert("로그인 실패: " + response.data.message);
            }
        } catch (error) {
            console.error(error);
            setMessage("서버 오류가 발생했습니다.");
            alert("서버 오류가 발생했습니다.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Username"
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
            {message && <p>{message}</p>}
        </form>
    );
};

export default Login;
