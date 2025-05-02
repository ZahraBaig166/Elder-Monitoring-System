const express = require('express');
const router = express.Router();
const { Patient } = require('../models');
const {Family}= require('../models'); // Adjust the path as needed

// Route to fetch all patients

router.get('/caregiver/:id/patients', async (req, res) => {
  console.log("in caregiver patients route");
  const caregiverId = req.params.id;

  try {
    if (!caregiverId) {
      return res.status(400).json({ message: 'Caregiver ID is required' });
    }

    const patients = await Patient.findAll({
      where: { assigned_caregiver_id: caregiverId }  // ✅ correct variable here
    });
 
// console.log("PATIENTS IN THE ROUTE FOUND ",patients)
    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients for caregiver:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



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

 /// Route to fetch medications for a specific patient

// router.post('/medications', async (req, res) => {
//   console.log("IN MEDICATIONS POST ROUTE") 
//   const { patient_id, name, dosage, interval, duration, start_date } = req.body;

//   if (!patient_id || !name || !start_date) {
//     return res.status(400).json({ error: 'Missing required fields' });
//   }

//   try {
//     const result = await db.query(
//       `INSERT INTO medications (patient_id, name, dosage, interval, duration, start_date)
//        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
//       [patient_id, name, dosage, interval, duration, start_date]
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error("Error inserting medication:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });


// router.get('/patients', async (req, res) => {
//   try {
//     const result = await db.query('SELECT id, name FROM patients ORDER BY id ASC');
//     res.json(result.rows);
//   } catch (err) {
//     console.error("Error fetching patients:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });


// // Assuming you have something like this in your backend
// router.get('/medications', async (req, res) => {
//   const { date } = req.query;
//   try {
//     const result = await db.query(
//       'SELECT * FROM medications WHERE start_date = $1',
//       [date]
//     );
//     res.json(result.rows);
//   } catch (err) {
//     console.error('Error fetching medications:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });



module.exports = router;
