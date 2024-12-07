const express = require("express");
const csvtojson = require("csvtojson");
let promiseObj = csvtojson().fromFile("mergedata.csv");

const { Pool } = require("pg");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const config = require('./config/config.json');
const bodyParser = require('body-parser');
const { Model } = require("sequelize");
const { sequelize } = require('./models');
const {caregiver, family, patient, device, alerts, medication_schedule, query, health_metrics, location_history } = require('./models'); // Import models


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable cross-origin requests
app.use(express.json()); // Parse JSON payloads

// PostgreSQL Connection Pool

const pool = new Pool({
  user: "postgres", // Your PostgreSQL username
  host: "localhost", // Database host
  database: "ElderlyMonitoring", // Your database name
  password: "laiba", // Your PostgreSQL password
  port: 5432, // Default PostgreSQL port
});

// Test Database Connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err);
  } else {
    console.log('PostgreSQL connected:', res.rows);
  }
});

// Example Routes
app.get("/", (req, res) => {
  res.send("API is running!");
});

// Example: Get All Users
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Example: Add a New User
app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [name, email]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Example: JWT Authentication
app.post("/auth/login", (req, res) => {
  const { username } = req.body;
  const token = jwt.sign({ username }, config.get("jwtPrivateKey"), {
    expiresIn: "1h",
  });
  res.json({ token });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

