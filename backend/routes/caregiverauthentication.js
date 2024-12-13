const express = require('express');
const bcrypt = require('bcrypt');
const { PendingCaregiver } = require('../models'); // Import PendingCaregiver model
const app= express();
const router = express.Router();
router.use(express.json());

// Registration route for Caregiver
router.post('/submit/caregiver', async (req, res) => {
  console.log("caregiver request body",req.body);

  const { name, email, age, address, educations } = req.body;

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

    // Send response back to frontend
    res.status(201).json({ message: 'Caregiver registration request has been submitted for approval' });
  } catch (error) {
    console.error('Error during caregiver registration:', error);
    res.status(500).send('Error registering caregiver');
  }
});


const { Caregiver } = require('../models'); // Import both models
const crypto = require('crypto'); // For generating a random password


// Login route for Caregiver
router.post('/login/caregiver', async (req, res) => {
  const { email, password } = req.body;
  console.log("hello")
  console.log(email,password);
    console.log("hello")

    const caregiver = await Caregiver.findOne({ where: { email } });
    console.log(caregiver);

    if (!caregiver) {
      return res.status(400).send('Caregiver not found');
    }
    // const isPasswordValid = await bcrypt.compare(password, caregiver.password);

    if (password!=caregiver.password) {
      return res.status(400).send('Invalid credentials');
    }
    // Send response with token
    res.status(200).send({ message: 'Caregiver logged in successfully' });

});
module.exports = router;