const express = require('express');
const router = express.Router();
const pool = require('./db');

// Test route
router.get('/', (req, res) => {
    res.json({ message: 'API is working' });
});

// Get all users
router.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a user
router.post('/users', async (req, res) => {
    const { name, email } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO users(name, email) VALUES($1, $2) RETURNING *',
            [name, email]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;