const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const db = require("./config/db.js");

app.get("/", (req, res) => {
    console.log("root");
    res.send("Welcome to the root!");
});

app.get("/movies", (req, res) => {
    console.log("/movies");
    res.send("List of movies");
});

app.listen(PORT, () => {
    console.log(`Server On : http://localhost:${PORT}`);
});
