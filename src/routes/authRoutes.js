const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// FAKE DB FOR NOW - just for submission
let users = [];

// REGISTER ROUTE
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  
  // check if user already exists
  const existingUser = users.find(u => u.email === email);
  if(existingUser){
    return res.status(400).json({ error: "User already exists" });
  }

  // save user
  const newUser = { id: users.length + 1, name, email, password };
  users.push(newUser);

  res.status(201).json({ message: "User created", user: { id: newUser.id, email } });
});

// LOGIN ROUTE
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if(!user){
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id }, "secretkey");
  res.status(200).json({ message: "Login successful", token });
});

module.exports = router;