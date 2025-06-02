const express = require('express');
const bcrypt = require('bcrypt');
const { PendingCaregiver,Query} = require('../models'); // Import PendingCaregiver model
const app= express();
const router = express.Router();
router.use(express.json());
const jwt = require('jsonwebtoken');
const {Patient } = require('../models'); 


router.get('/caregiver/:id/patients/counts', async (req, res) => {
  console.log("in caregiver patients counts route");
  const caregiverId = req.params.id;

  try {
    if (!caregiverId) {
      return res.status(400).json({ message: 'Caregiver ID is required' });
    }

    // ✅ Only fetch patients assigned to this caregiver
    const patients = await Patient.findAll({
      where: { assigned_caregiver_id: caregiverId }
    });
    // console.log("PATIENTS WHICH ARE ASSIGNED",patients);

    // ✅ Group counts by status
    const total = patients.length;
    const critical = patients.filter(p => p.status === 'critical').length;
    const moderate = patients.filter(p => p.status === 'moderate').length;
    const stable = patients.filter(p => p.status === 'stable').length;

    res.json({
      total,
      critical,
      moderate,
      stable,
      patients // optionally remove this if not needed in frontend
    });
  } catch (error) {
    console.error('Error fetching assigned patients:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Registration route for Caregiver
router.post('/submit/caregiver', async (req, res) => {
  console.log("caregiver request body",req.body);

  const { name, email, age, address, educations } = req.body;
  console.log("caregiver request body",req.body);
  console.log("educations",educations);

  // Check if all required fields are provided
  if (!name || !email || !age || !address || !educations) {
    return res.status(400).send('All fields are required.');
  }
  // Check if email already exists in the PendingCaregiver table
  try {
    const existingCaregiver = await PendingCaregiver.findOne({ where: { email } });
    if (existingCaregiver) {
      return res.status(400).send('Caregiver with this email already exists in pending requests.');
    }

    // Create new pending caregiver record
    const newPendingCaregiver = await PendingCaregiver.create({
      name,
      email,
      age,
      address,
      educations,
    });
    console.log("newPendingCaregiver",newPendingCaregiver);
res.status(201).json({ message: 'Caregiver registration request has been submitted for approval' });
    // Send response back to frontend
    // res.status(201).json({ message: 'Caregiver registration request has been submitted for approval' });
  } catch (error) {
    console.error('Error during caregiver registration:', error);
    res.status(500).send('Error registering caregiver');
  }
});
const { Caregiver } = require('../models'); // Import both models
const crypto = require('crypto'); // For generating a random password

router.post("/login/caregiver", async (req, res) => {
  console.log("in caregiver login route");
  const { email, password } = req.body;
  console.log("caregiver login request body",req.body);

  try {
    // Find caregiver by email
    const caregiver = await Caregiver.findOne({ where: { email } });
    console.log("caregiver",caregiver);
    if (!caregiver) {
      return res.status(400).send("Caregiver not found");
    }

    // Compare entered password with hashed password in DB
    const isPasswordValid = await bcrypt.compare(password, caregiver.password);
    if (!isPasswordValid) {
      return res.status(400).send("Invalid credentials");
    }

    // Generate JWT Token
    const token = jwt.sign({ id: caregiver.user_id }, "secret", {
      expiresIn: "1h",
    });

    // Send success response
    res.status(200).send({
      message: "Caregiver logged in successfully",
      token,
      userId: caregiver.user_id,
      type: "caregiver",
    });
  } catch (error) {
    console.error("Error in caregiver login:", error);
    res.status(500).send("Internal server error");
  }
});

router.get("/caregiverProfile/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Use findByPk to fetch caregiver details by primary key (user_id)
    const caregiver = await Caregiver.findByPk(id, {
      attributes: ["name", "email", "password"],
    });

    if (!caregiver) {
      return res.status(404).json({ message: "Caregiver not found" });
    }

    return res.status(200).json(caregiver);
  } catch (error) {
    console.error("Error fetching caregiver details:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

const {Note} = require('../models'); // Import Note model 
// router.post('/addnote', async (req, res) => {
//   console.log("in add note route");

//   // Destructuring data from the request body
//   const { caregiver_id, patient_id, note } = req.body;
//   console.log("Adding note:", caregiver_id, patient_id, note); // Debugging line    

//   // Check if required fields are missing
//   if (!caregiver_id || !patient_id || !note) {
//       return res.status(400).json({ success: false, message: "Missing required fields" });
//   }
//   console.log('Note model:', Note); 
//   try {
//       // Create the new note entry in the database
//       const newNote = await Note.create({
//           caregiver_id,
//           patient_id,
//           note,
//       });

//       // Return the success response with the newly created note
//       return res.json({ success: true, note: newNote });

//   } catch (error) {
//       // Catch errors if create fails
//       console.error("Error adding note:", error);  // Log the error for debugging

//       // Send a failure response if there's an issue
//       return res.status(500).json({ success: false, message: "Failed to add note", error: error.message });
//   }
// });

router.post('/addnote', async (req, res) => {
  console.log("in add note route");

  // Destructuring data from the request body
  const { caregiver_id, patient_id, note } = req.body;
  console.log("Adding note:", caregiver_id, patient_id, note); // Debugging line    

  // Check if required fields are missing
  if (!caregiver_id || !patient_id || !note) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
  }
  console.log('Note model:', Note); 
  try {
      // Create the new note entry in the database
      const newNote = await Note.create({
          caregiver_id,
          patient_id,
          note,
      });

      // Return the success response with the newly created note
      return res.json({ success: true, note: newNote });

  } catch (error) {
      // Catch errors if create fails
      console.error("Error adding note:", error);  // Log the error for debugging

      // Send a failure response if there's an issue
      return res.status(500).json({ success: false, message: "Failed to add note", error: error.message });
  }
});








// GET /patient/:patientId/notes - Fetch notes for a patient
router.get('/patient/:patient_id/notes', async (req, res) => {
    const { patient_id } = req.params;

    try {
        const notes = await Note.findAll({
            where: { patient_id },
            order: [['createdAt', 'DESC']],
        });

        res.json(notes);
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ success: false, message: "Failed to fetch notes" });
    }
});
const { MedicationSchedule } = require('../models'); 

router.post('/medications', async (req, res) => {
  console.log("in add medication route");

  const { patient_id, medication_name, dosage, interval, duration, next_dose_time } = req.body;
  console.log("Adding medication:", patient_id, medication_name, dosage, interval, duration, next_dose_time);

  if (!patient_id || !medication_name || !dosage || !interval || !duration || !next_dose_time) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    const newMedication = await MedicationSchedule.create({
      patient_id,
      medication_name,
      dosage,
      interval,
      duration,
      next_dose_time,
    });

    return res.json({ success: true, medication: newMedication });

  } catch (error) {
    console.error("Error adding medication:", error);

    return res.status(500).json({ success: false, message: "Failed to add medication", error: error.message });
  }
});

router.get('/caregiver/:caregiverId/medications', async (req, res) => {
  console.log("IN CAREGIVER MEDICATIONS ROUTE");
  const caregiverId = req.params.caregiverId;

  try {
    const [rows] = await db.promise().query(
      `
      SELECT 
        patients.name AS patient_name,
        medications.medication_name,
        medications.time
      FROM 
        patients
      INNER JOIN 
        medications ON patients.patient_id = medications.patient_id
      WHERE 
        patients.caregiver_id = ?
      ORDER BY 
        medications.time ASC
      `,
      [caregiverId]
    );

    res.json(rows);
  } catch (error) {
    console.error('Error fetching medication schedule:', error);
    res.status(500).json({ error: 'Failed to fetch medication schedule.' });
  }
});

router.get('/caregiver/:caregiverId/medications/counts', async (req, res) => {
  const { caregiverId } = req.params;
  try {
    const medicationSchedules = await MedicationSchedule.findAll({
      include: {
        model: Patient,
        as: 'patient',
        attributes: ['name'],  // Only fetch patient's name
        where: { assigned_caregiver_id: caregiverId },
      },
      attributes: ['medication_name', 'next_dose_time'], // Only needed fields
      order: [['next_dose_time', 'ASC']],
    });

    // Format response
    const response = medicationSchedules.map(schedule => ({
      patient_name: schedule.patient.name,
      medication_name: schedule.medication_name,
      time: schedule.next_dose_time, // This will be in DateTime format
    }));

    res.json({ medicationSchedules: response });
  } catch (error) {
    console.error('Error fetching medication schedule:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/patientclicked/:patientId', async (req, res) => {
  const { patientId } = req.params;

  try {
    const patient = await Patient.findOne({ where: { patient_id: patientId } });

    if (!patient) {
      return res.status(404).send({ message: 'Patient not found' });
    }

    res.status(200).send({ name: patient.name });
  } catch (error) {
    console.error("Error in /patient/:patientId route:", error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

router.get('/notes/:patientId', async (req, res) => {
  console.log("in INDIVIDUAL PATIENT NOTES ROUTE");
  const { patientId } = req.params;

  if (!patientId) {
    return res.status(400).json({ success: false, message: 'Missing patientId' });
  }

  try {
    const notes = await Note.findAll({
      where: { patient_id: patientId },
      order: [['timestamp', 'DESC']],
    });
    console.log("NOTES",notes);

    if (!notes.length) {
      return res.status(404).json({ success: false, message: 'No notes found for this patient.' });
    }

    return res.json({ success: true, data: notes });
  } catch (error) {
    console.error('Error fetching notes by patientId:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});



module.exports = router;