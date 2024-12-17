const express = require('express');
const bcrypt = require('bcrypt');
const { PendingCaregiver,Query} = require('../models'); // Import PendingCaregiver model
const app= express();
const router = express.Router();
router.use(express.json());
const jwt = require('jsonwebtoken');
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
  const { email, password } = req.body;

  try {
    // Find caregiver by email
    const caregiver = await Caregiver.findOne({ where: { email } });
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


router.post('/add-query', async (req, res) => {
  const { userId, subject, recepient, phone, message, type } = req.body;
  console.log(userId);
  console.log(subject);
  console.log("hello im,",recepient);
  console.log(phone);
  console.log(message);
  console.log(type);
  try {
    if (!userId || !subject || !phone || !message || !type ||!recepient) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Check if senderType is either 'caregiver' or 'family'
    if (!['caregiver', 'family'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid sender type' });
    }

    // Save query to the database
    const newQuery = await Query.create({
      sender_id: userId,
      sender_type: type,
      recepient:recepient,
      subject,
      phone_number: phone,
      message,
      dateCreated: new Date(),
    });

    return res.status(200).json({ success: true, message: 'Query submitted successfully' });
  } catch (error) {
    console.error('Error adding query:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
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
module.exports = router;