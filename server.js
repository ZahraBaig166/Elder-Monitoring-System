// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/health-metrics/all', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM Health_Metrics ORDER BY timestamp DESC'
        );
        res.json(result.rows); 
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/test-db', (req, res) => {
    pool.query('SELECT NOW()', (err, result) => {
      if (err) return res.status(500).send('Database error');
      res.send('Database connected! Current time: ' + result.rows[0].now);
    });
  });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
