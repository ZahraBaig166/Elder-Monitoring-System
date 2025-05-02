const express = require('express');
const router = express.Router();
const { Alerts } = require('../models'); // Import the Alerts model


router.get("/alerts", async (req, res) => {
  try {
    const allAlerts = await Alerts.findAll(); 
    return res.status(200).json(allAlerts);
  } catch (error) {
    console.error("Error fetching alerts:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Route: POST /alert/:patient_id/:type
router.post('/alert/:patient_id/:type', async (req, res) => {
  const { patient_id, type } = req.params;

  try {
    const newAlert = await Alerts.create({
      patient_id: parseInt(patient_id), // Ensure patient_id is an integer
      type,
      is_acknowledged: false, // Default to false
    });

    return res.status(201).json({
      message: 'Alert added successfully',
      alert: newAlert,
    });
  } catch (error) {
    console.error('Error adding alert:', error);
    return res.status(500).json({
      message: 'Internal server error while adding alert',
      error: error.message,
    });
  }
});

module.exports = router;