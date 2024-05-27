import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import imgUrl from "../img/character1.png";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Email:", email, "Password:", password);
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
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit">Login</button>
                        <p className="message">
                            Not registered?{" "}
                            <Link to="/create-account">Create an account</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
