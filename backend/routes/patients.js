const express = require('express');
const router = express.Router();
const { Patient } = require('../models'); // Adjust the path as needed

// Route to fetch all patients
router.get('/patients', async (req, res) => {
  try {
    const patients = await Patient.findAll();
    res.status(200).json(patients);
  } catch (error) {
    console.error('Error fetching all patients:', error);
    res.status(500).json({ error: 'Failed to fetch all patients' });
  }
});

// Route to fetch critical patients
router.get('/patients/critical', async (req, res) => {
  try {
    const criticalPatients = await Patient.findAll({where: { status: 'Critical' },});
    res.status(200).json(criticalPatients);
  } catch (error) {
    console.error('Error fetching critical patients:', error);
    res.status(500).json({ error: 'Failed to fetch' });
  }
});

// Route to fetch patient counts
router.get('/patients/counts', async (req, res) => {
  try {
    const total = await Patient.count();
    console.log("total",total)
    const critical = await Patient.count({ where: { status: 'critical' } });
    console.log("critical",critical)

    const moderate = await Patient.count({ where: { status: 'moderate' } });
    console.log("moderate",moderate)

    const stable = await Patient.count({ where: { status: 'stable' } });
    console.log("stable",stable)

    res.status(200).json({ total, critical, moderate, stable });
  } catch (error) {
    console.error('Error fetching patient counts:', error);
    res.status(500).json({ error: 'Failed to fetch patient counts' });
  }
});

module.exports = router;
