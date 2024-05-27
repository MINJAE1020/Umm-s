import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./component/LoginForm";
import CreateAccount from "./component/CreateAccount";
const App = () => {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<LoginForm />} />
                <Route path="/create-account" element={<CreateAccount />} />
            </Routes>
        </Router>
    );
};

export default App;
