import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // BrowserRouter와 Routes로 변경
import LoginForm from './component/LoginForm';
import Home from './component/Home';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} /> {/* path와 element 속성으로 변경 */}
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
