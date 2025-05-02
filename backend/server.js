const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const config = require('./config/config.json');
const bodyParser = require('body-parser');
const db = require('./models'); // Import the models and Sequelize instance

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Test Database Connection
db.sequelize.authenticate()
  .then(() => {
    console.log('PostgreSQL connected with Sequelize!');
  })
  .catch(err => {
    console.error('Error connecting to PostgreSQL using Sequelize:', err);
  });
// db.sequelize.sync({ alter: true });

// Sync Models with Database
db.sequelize.sync({ force: false }) // Use force: true only during development
  .then(() => {
    console.log('All models are synchronized with the database!');
  })
  .catch(err => {
    console.error('Error synchronizing models:', err);
  });

const adminRouter = require('./routes/adminroutes'); // Assuming your routes are in adminRoutes.js
app.use('/', adminRouter); // Or '/admin', depending on your structure
// Example: Check Tables
const familyRouter = require('./routes/familyauthentication');
app.use("/",familyRouter);
const caregiverRouter = require('./routes/caregiverauthentication');
app.use("/",caregiverRouter);
const patientRoutes = require('./routes/patients');
app.use("/", patientRoutes);
const forgotpwRouter = require('./routes/forgotpwauthentication');
app.use("/",forgotpwRouter);
const alertroute=require('./routes/alertroutes')
app.use("/",alertroute);


app.get('/checktables', async (req, res) => {
  try {
    const result = await db.sequelize.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('health_metrics', 'location_history', 'alerts', 'medication_schedule', 'query', 'device', 'patient', 'family', 'caregiver');
    `);
    res.json(result[0]); // Sends the list of tables if they exist
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tables' });
  }
});

app.get('/config', (req, res) => {
  // Send the relevant environment variables as JSON
  console.log(process.env.API_BASE_URL);
  res.json({
    apiBaseUrl: process.env.API_BASE_URL,
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
