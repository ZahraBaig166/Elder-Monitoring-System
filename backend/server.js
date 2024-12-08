const express = require("express");
// const csvtojson = require("csvtojson");
// let promiseObj = csvtojson().fromFile("mergedata.csv");

const { Pool } = require("pg");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const config = require('./config/config.json');
const bodyParser = require('body-parser');
// const { sequelize } = require('./models');
const { Sequelize } = require('sequelize'); 
const {caregiver, family, patient, device, alerts, medication_schedule, query, health_metrics, location_history } = require('./models'); // Import models
const HealthMetrics = require('./models/health_metrics');
const LocationHistory = require('./models/location_history');
const Alerts = require('./models/alerts');
const MedicationSchedule = require('./models/medication_schedule');
const Query = require('./models/query');
const Device = require('./models/device');
const Patient = require('./models/patient');
const Family = require('./models/family');
const Caregiver = require('./models/caregiver');
const PendingFamily = require('./models/pending_family');
const PendingCaregiver = require('./models/pending_caregiver');



const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable cross-origin requests
app.use(express.json()); // Parse JSON payloads

// PostgreSQL Connection Pool

const sequelize = new Sequelize('ElderlyMonitoring', 'postgres', 'laiba', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432, // Default PostgreSQL port
  logging: false, // Disable SQL logging if not needed
});

// Test Database Connection
sequelize.authenticate()
  .then(() => {
    console.log('PostgreSQL connected with Sequelize!');
  })
  .catch(err => {
    console.error('Error connecting to PostgreSQL using Sequelize:', err);
  });
// Example Routes
app.get("/", (req, res) => {
  res.send("API is running!");
});
// Sync Models with Database
sequelize.sync({ force: true }) // set force: true to drop and recreate tables
  .then(() => {
    console.log('All models are synchronized with the database!');
  })
  .catch(err => {
    console.error('Error syncing models:', err);
  });
  sequelize.sync({ force: true })
  .then(() => {
    console.log('Tables have been created!');
  })
  .catch(err => {
    console.error('Error syncing models:', err);
  });

  HealthMetrics.sync({ force: false })
  .then(() => {
    console.log('HealthMetrics table created!');
  })
  .catch(err => {
    console.error('Error syncing HealthMetrics table:', err);
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
app.get('/checktables', async (req, res) => {
  try {
    const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('health_metrics', 'location_history', 'alerts', 'medication_schedule', 'query', 'device', 'patient', 'family', 'caregiver');
    `);
    res.json(result.rows); // Sends the list of tables if they exist
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tables' });
  }
});
// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

