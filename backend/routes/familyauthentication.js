const express = require('express');
const { PendingFamily, Family, Patient, Caregiver,HealthMetric,UserActivity, MedicationSchedule, sequelize } = require('../models');

const app = express();
const { Op } = require("sequelize");
const router = express.Router();
router.use(express.json());
const jwt = require('jsonwebtoken');

router.post('/family/getPatientMedications', async (req, res) => {
  console.log("FETCHING MEDICATIONS FOR FAMILY:");
  const { family_id } = req.body;

  if (!family_id) {
    return res.status(400).json({ success: false, message: "Missing family_id" });
  }

  try {
    const family = await Family.findOne({ where: { user_id: family_id } });

    if (!family) {
      return res.status(404).json({ success: false, message: 'No family found with this ID.' });
    }

    const { patient_id } = family;

    const medications = await MedicationSchedule.findAll({
      where: { patient_id },
      order: [['next_dose_time', 'ASC']],
    });
    console.log("Fetched Medications:", medications);

    return res.json({ success: true, data: medications });
  } catch (err) {
    console.error("Error fetching medication schedule:", err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


router.post('/submit/family', async (req, res) => {
  console.log("IN BACK END");
  console.log("request body", req.body);

  // Extract fields from the request body
  const { 
    name, 
    email, 
    relationship,  // Extract 'relationship' from request body
    phone, 
    address, 
    patient  // Nested patient object
  } = req.body;

  console.log('phone number:',phone);

  console.log("PATIENNT OBJECT ", patient);

  // Extract patient details from the nested 'patient' object
  const { 
    name: patient_name, 
    age: patient_age, 
    medicalCondition: patient_medical_conditions, 
    status: patient_status, 
    emergencyContact: patient_emergency_contact 
  } = patient;

  console.log("Received data: ", req.body);  // Debugging log

  try {
    // Explicitly assign relationship_to_patient to relationship
    const newPendingFamily = await PendingFamily.create({
      name,

      email,
      relationship_to_patient: relationship, // Explicitly assign the relationship
      phone_number:phone,            // This should match the model field
      address,
      patient_name,            // Match patient name
      patient_age,             // Match patient age
      patient_medical_conditions,  // Match patient condition
      patient_status,          // Match patient status
      patient_emergency_contact, // Match patient emergency contact
    });

    res.status(201).send('Family registration request submitted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error submitting family registration request');
  }
});


 const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

// Login route for Admin or Caregiver  9784f0
router.post("/login/family/:email/:password", async (req, res) => {
  console.log("in family login route");
  const { email, password } = req.params;

  try {
    const family = await Family.findOne({ where: { email } });

    if (!family) {
      return res.status(400).send({ message: "Family not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, family.password);
    if (!isPasswordValid) {
      return res.status(400).send({ message: "Invalid credentials" });
    }

    const token = "some-generated-token"; // Replace with JWT if needed
    // Log activity
    const activityLog= await UserActivity.create({
      user_type: "family",
      family_id: family.user_id,
      activity_time: new Date(),
    });
console.log("caregiver USER ACTIVITY", activityLog);
    res.status(200).send({
      message: "Family logged in successfully",
      token,
      userId: family.user_id,
      type: "family",
    });
  } catch (error) {
    console.error("Error in family login:", error);
    res.status(500).send("Internal server error");
  }
});

router.get("/health-metrics/:patientId", async (req, res) => {
  const { patientId } = req.params;
  const startTime = "2016-04-12 12:00:00+05:00";
  const endTime = "2016-04-12 16:00:00+05:00";
  // console.log("in metrics",patientId)
  try {
    const metrics = await HealthMetric.findAll({
      where: {
        patient_id: patientId,
        time: {
          [Op.between]: [startTime, endTime], // Example time range
        },
      },
      order: [["time", "ASC"]], // Sort the metrics by time in ascending order
    });
    // console.log("Metrics",metrics.slice(0, 5)); // Debugging log
    res.status(200).json(metrics); // Send fetched metrics as JSON
  } catch (error) {
    console.error("Error fetching health metrics:", error);
    res.status(500).json({ message: "Error fetching health metrics", error });
  }
})

router.get('/patientsreport/:patientId', async (req, res) => {
 console.log("FETCHING PATIENT DETSILD FOR REPORT " , req.params.patientId);
  try {
    const patientId = req.params.patientId;

    const patient = await Patient.findOne({
      where: { patient_id: patientId },
      include: [
        {
          model: Caregiver,
          as: 'caregiver',
          attributes: ['name', 'email'] // Include relevant fields
        }
      ]
    });
    console.log("Fetched patient data:", patient); // Debugging log

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(patient);
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get("/family/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

// console.log("Fetching family members for userId:", userId);
    const familyMembers = await Family.findAll({
      where: { user_id: userId },
      attributes: ['patient_id']
    });
// console.log("Fetched family members:", familyMembers); // Debugging log 
    res.json(familyMembers);
  } catch (err) {
    console.error("Error fetching family members:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get('/patient/:patientId', async (req, res) => {
  const { patientId } = req.params;
  // console.log("Checking patientId from family:", patientId);

  try {
    // Step 1: Check if patientId exists in the family table
    const familyMember = await Family.findOne({ where: { patient_id: patientId } });

    if (!familyMember) {
      return res.status(403).send({ message: 'Access denied: patient not in family table' });
    }

    // Step 2: Fetch patient info only if in family table
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

const { Note } = require('../models');

// Get notes for a specific patient
router.post('/family/getPatientNotes', async (req, res) => {
  const { family_id } = req.body;

  if (!family_id) {
    return res.status(400).json({ success: false, message: "Missing family_id" });
  }

  try {
    // Step 1: Find the patient_id that belongs to this family
    const family = await Family.findOne({
      where: { user_id: family_id }, // Assuming the `family_id` is stored in the `Family` table
    });

    // If no family is found, return an error
    if (!family) {
      return res.status(404).json({ success: false, message: 'No family found with this ID.' });
    }

    // Get the patient_id from the family record
    const { patient_id } = family;

    // Step 2: Fetch notes for the patient using patient_id (cast to bigint)
    const notes = await Note.findAll({
      where: sequelize.where(
        sequelize.cast(sequelize.col('patient_id'), 'BIGINT'),
        patient_id
      ),
      order: [['timestamp', 'DESC']],  // Sort notes by creation date
    });

    if (!notes.length) {
      return res.status(404).json({ success: false, message: 'No notes found for this patient.' });
    }

    return res.json({ success: true, data: notes });
  } catch (error) {
    console.error('Error fetching notes:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.get("/health-metrics-reports/:patientId", async (req, res) => {
  const { patientId } = req.params;

  // Full day time range for 2016-04-12
  const startTime = "2016-04-12 08:00:00+05:00";
  const endTime = "2016-04-12 22:58:00+05:00";

  try {
    const metrics = await HealthMetric.findAll({
      where: {
        patient_id: patientId,
        time: {
          [Op.between]: [startTime, endTime],
        },
      },
      attributes: ["value", "calories", "steps", "distance", "time"],
      order: [["time", "ASC"]],
    });

    if (!metrics.length) {
      return res.status(404).json({ message: "No metrics found in selected time range." });
    }

    // Filter and extract each metric
    const bpmArr = metrics.map(m => m.value).filter(v => v != null);
    const caloriesArr = metrics.map(m => m.calories).filter(v => v != null);
    const stepsArr = metrics.map(m => m.steps).filter(v => v != null);
    const distanceArr = metrics.map(m => m.distance).filter(v => v != null);

    // Helper to get avg, min, max
    const getStats = (arr) => {
      const sum = arr.reduce((acc, val) => acc + val, 0);
      const avg = +(sum / arr.length).toFixed(2);
      const min = Math.min(...arr);
      const max = Math.max(...arr);
      return { avg, min, max };
    };

    // Response JSON
    const response = {
      bpm: getStats(bpmArr),
      calories: getStats(caloriesArr),
      steps: getStats(stepsArr),
      distance: getStats(distanceArr),
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching health metrics:", error);
    res.status(500).json({ message: "Error fetching health metrics", error });
  }
});



module.exports = router;