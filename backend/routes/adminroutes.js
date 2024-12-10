const express = require('express');
const bcrypt = require('bcrypt');
// const { PendingCaregiver } = require('../models/pending_caregiver'); // Import PendingCaregiver model
// const { PendingFamily } = require('../models/pending_family'); // Import PendingFamily model
const { PendingFamily, Family, Patient, PendingCaregiver, sequelize } = require('../models');

const {patient} = require('../models/patient');


const router = express.Router();
require('dotenv').config();


// Correct usage: Apply express.json() as middleware
router.use(express.json());
router.post('/admin/login', (req, res) => {
    const { email, password } = req.body;
    
    console.log("Received username:", email);
    console.log("Received password:", password);
    console.log("actual email", process.env.ADMIN_USERNAME);
    console.log("actual password", process.env.ADMIN_PASSWORD);


    if (email !== process.env.ADMIN_USERNAME) {
      return res.status(401).json({ message: 'Invalid email (username)' });
    }
  
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: 'Invalid password' });
    }
  
    return res.status(200).json({ message: 'Login successful' });
  });
  
  router.get('/admin/pending', async (req, res) => {
    try {
      // Declare pendingFamilies outside the try block
      let pendingFamilies = [];
  
      try {
        // Fetch pending families from the database
        
      // const pendingCaregivers = await PendingCaregiver.findAll();
      // console.log("caregiver", pendingCaregivers);
        pendingFamilies = await PendingFamily.findAll();
        console.log("family", pendingFamilies);
      } catch (error) {
        console.error('Error fetching families:', error);
        return res.status(500).json({ message: 'Error fetching pending requests', error });
      }
  
      // Map over the results to get plain data
      res.json({
                // caregivers: pendingCaregivers.map(c => c.get({ plain: true })),

        families: pendingFamilies.map(f => f.get({ plain: true })),
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching pending requests', error });
    }
  });
  


// Admin Routes

// Get details for a specific pending request (Caregiver or Family)
// router.get('/admin/requestDetails/:requestId', async (req, res) => {
//     const { requestId } = req.params;
//     try {
//       // const caregiver = await PendingCaregiver.findByPk(requestId);
//       const family = await PendingFamily.findByPk(requestId);
//       console.log("family request,",family);
      
//       if (caregiver) {
//         res.json(caregiver);
//       } else if (family) {
//         console.log("hello");
//         res.json(family);
//       } else {
//         res.status(404).json({ message: 'Request not found' });
//       }
//     } catch (error) {
//       res.status(500).json({ message: 'Error fetching request details', error });
//     }
//   });
  
  // Get details for a specific pending request (Caregiver or Family)
router.get('/admin/requestDetails/:requestId', async (req, res) => {
  const { requestId } = req.params;
  try {
    // Only querying for family now
    const family = await PendingFamily.findByPk(requestId);
    console.log("family request,", family);
    
    if (family) {
      console.log("hello");  // Logs the hello when family is found
      res.json(family);      // Send family details as JSON response
    } else {
      res.status(404).json({ message: 'Request not found' });
    }
  } catch (error) {
    console.error('Error:', error); // Log the error for debugging
    res.status(500).json({ message: 'Error fetching request details', error });
  }
});

// Route to approve caregiver or family request
router.post('/admin/approve/:requestId', async (req, res) => {
    const { requestId } = req.params;
    const { caregiverId } = req.body; // caregiverId is provided only for family approval
  
    try {
      // Try to find the pending caregiver request
      const pendingCaregiver = await PendingCaregiver.findOne({ where: { id: requestId } });
  
      if (pendingCaregiver) {
        // Generate a random password for the caregiver
        const randomPassword = crypto.randomBytes(8).toString('hex'); // 8-byte random password
  
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(randomPassword, 10);
  
        // Create a new caregiver in the Caregiver table
        const newCaregiver = await Caregiver.create({
          name: pendingCaregiver.name,
          email: pendingCaregiver.email,
          password: hashedPassword, // Store the hashed password
          age: pendingCaregiver.age,
          address: pendingCaregiver.address,
          education: pendingCaregiver.education,
        });
  
        // Optionally, you can send the random password to the caregiver (e.g., via email)
  
        // Now destroy the pending caregiver request
        await PendingCaregiver.destroy({ where: { id: requestId } });
  
        return res.status(200).json({ message: 'Caregiver approved and registered successfully' });
      }
  
      // If the pending caregiver wasn't found, check if it's a pending family request
      const pendingFamily = await PendingFamily.findOne({ where: { id: requestId } });
  
      if (pendingFamily) {
        // Ensure caregiverId is provided for family approval
        if (!caregiverId) {
          return res.status(400).json({ message: 'Caregiver ID is required for family approval' });
        }
  
        // Generate a random password for the family
        const randomPassword = crypto.randomBytes(8).toString('hex');
  
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(randomPassword, 10);
  
        // Create a new family entry in the Family table
        const newFamily = await Family.create({
          name: pendingFamily.name,
          email: pendingFamily.email,
          password: hashedPassword, // Store the hashed password
          phone_number: pendingFamily.phone_number,
          address: pendingFamily.address,
        });
  
        // Create a new patient entry linked to the family and caregiver
        await Patient.create({
          name: pendingFamily.patient_name,
          age: pendingFamily.patient_age,
          medical_conditions: pendingFamily.medical_conditions,
          emergency_contact: pendingFamily.emergency_contact,
          assigned_caregiver_id: caregiverId,
          family_id: newFamily.id, // Link the patient to the newly created family
        });
  
        // Optionally, you can send the random password to the family (e.g., via email)
  
        // Destroy the pending family request
        await PendingFamily.destroy({ where: { id: requestId } });
  
        return res.status(200).json({ message: 'Family and patient approved successfully' });
      }
  
      // If neither a pending caregiver nor a pending family request is found
      return res.status(404).json({ message: 'Request not found' });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error approving request', error });
    }
  });
  
  
  
  // Decline a request
  router.post('/admin/decline/:requestId', async (req, res) => {
    const { requestId } = req.params;
    try {
      // Decline the request logic
      await PendingCaregiver.destroy({ where: { id: requestId } });
      await PendingFamily.destroy({ where: { id: requestId } });
      res.status(200).json({ message: 'Request declined successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error declining request', error });
    }
  });

  router.get('/admin/caregivers', async (req, res) => {
    try {
      // Fetch all caregivers from the database
      const caregivers = await Caregiver.findAll();
      
      // Send the list of caregivers as a response
      res.json(caregivers);
    } catch (error) {
      console.error('Error fetching caregivers:', error);
      res.status(500).json({ message: 'Error fetching caregivers', error });
    }
  });

module.exports = router;