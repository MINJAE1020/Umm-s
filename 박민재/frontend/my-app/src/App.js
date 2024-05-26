import React from "react";

function App() {
    const selectAll = () => {
        alert("selectAll!");
    };

    return (
        <div id="App">
            <h1>React-Express-MySQL 연결</h1>
            <button onClick={selectAll}>모두 조회</button>
        </div>
    );
}

export default App;
