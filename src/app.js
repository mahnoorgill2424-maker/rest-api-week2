const express = require("express");
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const AppError = require('./errors/AppError');
const logger = require('./utils/logger');
const { paginationSchema } = require('./validators/authValidators');

const app = express();
app.use(express.json());

// Request ID Middleware + Structured Logs
app.use((req, res, next) => {
  const id = req.headers['x-request-id'] || uuidv4();
  req.id = id;
  res.setHeader('X-Request-Id', id);
  logger.info({ requestId: req.id, method: req.method, url: req.url }, "request_started");
  next();
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.connect().then(()=>console.log("✅ Connected to Neon DB")).catch(e=>console.log(e.message));

app.get("/", (req, res) => {
  res.json({ message: "Week 4 API IS ALIVE 🔥", requestId: req.id });
});

app.get("/api/users", async (req, res, next) => {
  try {
    const { error, value } = paginationSchema.validate(req.query);
    if (error) {
      throw new AppError("VALIDATION_ERROR", error.details[0].message, 400);
    }
    const { page, limit, sort, order, search } = value;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM users';
    let countQuery = 'SELECT COUNT(*) FROM users';
    let params = [];
    let countParams = [];

    if (search) {
      query += ' WHERE email ILIKE $1';
      countQuery += ' WHERE email ILIKE $1';
      params.push(`%${search}%`);
      countParams.push(`%${search}%`);
    }

    const totalResult = await pool.query(countQuery, countParams);
    const total = parseInt(totalResult.rows[0].count);

    query += ` ORDER BY ${sort} ${order.toUpperCase()} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    res.json({
      success: true,
      requestId: req.id,
      data: result.rows,
      metadata: { page, limit, total, totalPages: Math.ceil(total/limit) }
    });

  } catch (err) { next(err); }
});

// Global Error Handler - No stack in production
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const code = err.code || "INTERNAL_ERROR";
  logger.error({ requestId: req.id, code, status, message: err.message, stack: err.stack }, "request_failed");
  const isProd = process.env.NODE_ENV === 'production';
  res.status(status).json({
    success: false,
    error: { code, message: status === 500 && isProd? "Internal Server Error" : err.message },
    requestId: req.id
  });
});

module.exports = app;