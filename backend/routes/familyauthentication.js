const express = require('express');
const { PendingFamily, Family, Patient, Caregiver, sequelize } = require('../models');

const app = express();

const router = express.Router();
router.use(express.json());
const jwt = require('jsonwebtoken');

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

// Login route for Admin or Caregiver
;

// Family Login Route
router.post("/login/family", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find family user by email
    const family = await Family.findOne({ where: { email } });
    if (!family) {
      return res.status(400).send("Family not found");
    }

    // Compare entered password with hashed password in DB
    const isPasswordValid = await bcrypt.compare(password, family.password);
    if (!isPasswordValid) {
      return res.status(400).send("Invalid credentials");
    }

    // Generate JWT Token
    const token = jwt.sign({ id: family.user_id }, "secret", {
      expiresIn: "1h",
    });

    // Send success response
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

module.exports = router;