const express = require("express");
const app = express();

// Route 1: Home
app.get("/", (req, res) => {
  res.send("IT WORKS!!!");
});

// Route 2: Get all users
app.get("/users", (req, res) => {
  const users = [
    { id: 1, name: "Ali", city: "Tando Adam" },
    { id: 2, name: "Sara", city: "Karachi" },
    { id: 3, name: "Ahmed", city: "Lahore" }
  ];
  
  res.json(users); // .json sends data instead of text
});

module.exports = app;