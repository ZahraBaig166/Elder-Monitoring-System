const express = require('express');
const { PendingFamily, Family, Patient, Caregiver, sequelize } = require('../models');

const app = express();

const router = express.Router();
router.use(express.json());

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


// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

// Login route for Admin or Caregiver
router.post('/login/family', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the email belongs to a Caregiver or Admin
    let user = await Family.findOne({ where: { email } });

    if (!user) {
          return res.status(400).send('Family not found');
    }
      
    // Check if password is correct
    // const isPasswordValid = await bcrypt.compare(password, user.password);

    if (password!=user.password) {
      return res.status(400).send('Invalid credentials');
    }

    // // Generate a JWT token
    // const token = jwt.sign({ id: user.id, role: user.role }, 'your_secret_key', { expiresIn: '1h' });

    // // Return the token in the response
    // res.status(200).json({ message: 'Login successful', token });
    res.status(200).send({ message: 'Family logged in successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).send('Error during login');
  }
});
module.exports = router;