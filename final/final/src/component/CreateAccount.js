import { Link } from "react-router-dom";
import React, { useState } from "react";
import "../App.css";
import imgUrl from "../img/character1.png";

const CreateAccount = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(
            "Create Account Success!&n",
            "Email: ",
            email,
            "Password: ",
            password
        );
    };
    return (
        <div>
            <div className="createAccount-display">
                <div className="nav">
                    <h1>Umm's</h1>
                </div>

                <div className="main-content">
                    <div className="main-content">
                        <div className="img-content">
                            <img src={imgUrl} alt="캐릭터이미지"></img>
                        </div>

                        <div className="createAccount-Content">
                            <div className="title">
                                <h1>Create New Account</h1>
                            </div>
                            <form
                                className="createAccount-from"
                                onSubmit={handleSubmit}
                            >
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                ></input>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                ></input>
                                <button type="submit">Create Account</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <Link to="/">Back to Login</Link>
        </div>
    );
};

export default CreateAccount;
