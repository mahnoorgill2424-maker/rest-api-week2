const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(express.json()); // to read JSON from POST requests

// DB Connection to Neon
const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_6RzmHsOY2rvX@ep-super-heart-axck5v6r-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  ssl: { rejectUnauthorized: false }
});

// Test if DB connects
pool.query('SELECT NOW()')
  .then(() => console.log('✅ Connected to Neon DB'))
  .catch(err => console.log('❌ DB Connection Error:', err.message));


// ============ ROUTES ============

// 1. Health Check
app.get('/api', (req, res) => {
    res.json({ message: 'API is working' });
});


// 2. USERS ROUTES
app.get('/api/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users ORDER BY id');
        res.json(result.rows);
    } catch (err) {
        console.log("DB ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});


// 3. PROJECTS ROUTES
app.get('/api/projects', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM projects ORDER BY id');
        res.json(result.rows);
    } catch (err) {
        console.log("DB ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});


// 4. TASKS ROUTES
app.get('/api/tasks', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tasks ORDER BY id');
        res.json(result.rows);
    } catch (err) {
        console.log("DB ERROR:", err);
        res.status(500).json({ error: err.message});
    }
});


// ============ SERVER START ============
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});