const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { PendingFamily, Family, Patient, PendingCaregiver, Caregiver, sequelize } = require('../models');
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
      let pendingCaregivers = [];
  
      try {
        // Fetch data from models
        pendingCaregivers = await PendingCaregiver.findAll();
        pendingFamilies = await PendingFamily.findAll();
        console.log('Caregivers fetched:', pendingCaregivers);
        console.log('Families fetched:', pendingFamilies);
      } catch (fetchError) {
        console.error('Error fetching families or caregivers:', fetchError); // Log detailed error
        return res.status(500).json({ message: 'Error fetching pending requests', error: fetchError });
      }
  
      // Map over the results to get plain data
      res.json({
        caregivers: pendingCaregivers.map(c => c.get({ plain: true })),
        families: pendingFamilies.map(f => f.get({ plain: true })),
      });
    } catch (error) {
      console.error('Unexpected error:', error); // Log unexpected errors
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
  router.get('/admin/requestDetails/:requestType/:requestId', async (req, res) => {
    const { requestType, requestId } = req.params; // Extract both requestType and requestId from URL params
  
    try {
      if (requestType === 'Family') {
        const family = await PendingFamily.findByPk(requestId);
        console.log("family request:", family);
        if (family) {
          res.json(family);  // Send family details as JSON response
        } else {
          res.status(404).json({ message: 'Family request not found' });
        }
      } else if (requestType === 'Caregiver') {
        const caregiver = await PendingCaregiver.findByPk(requestId);
        console.log("caregiver request:", caregiver);
        if (caregiver) {
          res.json(caregiver);  // Send caregiver details as JSON response
        } else {
          res.status(404).json({ message: 'Caregiver request not found' });
        }
      } else {
        res.status(400).json({ message: 'Invalid request type' });
      }
    } catch (error) {
      console.error('Error fetching request details:', error);
      res.status(500).json({ message: 'Error fetching request details', error });
    }
  });
  

router.get('/admin/caregivers', async (req, res) => {
  try {
    const caregivers = await Caregiver.findAll(); // Fetch all caregivers
    console.log("Backend fetched caregivers:", caregivers);
    if (!caregivers || caregivers.length === 0) {
      return res.status(404).send('No caregivers found.');
    }
    res.status(200).json(caregivers);
  } catch (error) {
    console.error('Error fetching caregivers:', error);
    res.status(500).send('Failed to fetch caregivers');
  }
});


// Route to approve caregiver or family request
router.post('/admin/approve/:requestType/:requestId', async (req, res) => {
  const { requestType, requestId } = req.params;
  try {
    if (requestType === 'Caregiver') {
      // Handle pending caregiver request approval
      const pendingCaregiver = await PendingCaregiver.findByPk(requestId);
      if (pendingCaregiver) {
        const randomPassword = crypto.randomBytes(8).toString('hex');
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        // Create caregiver in database
        const newCaregiver = await Caregiver.create({
          name: pendingCaregiver.name,
          email: pendingCaregiver.email,
          password: hashedPassword,
          age: pendingCaregiver.age,
          address: pendingCaregiver.address,
          education: pendingCaregiver.education,
        });

        // Remove pending caregiver entry
        await PendingCaregiver.destroy({ where: { id: requestId } });

        return res.status(200).json({ message: 'Caregiver approved and registered successfully' });
      } else {
        return res.status(404).json({ message: 'Caregiver request not found' });
      }
    } else if (requestType === 'Family') {
      // Handle pending family request approval without assigning a caregiver initially
      const pendingFamily = await PendingFamily.findByPk(requestId);
      if (pendingFamily) {
        const randomPassword = crypto.randomBytes(8).toString('hex');
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        const newPatient = await Patient.create({
          name: pendingFamily.patient_name,
          age: pendingFamily.patient_age,
          medical_conditions: pendingFamily.medical_conditions,
          emergency_contact: pendingFamily.emergency_contact,
          status: pendingFamily.patient_status,
        });

        const newFamily = await Family.create({
          name: pendingFamily.name,
          email: pendingFamily.email,
          password: hashedPassword,
          relationship: pendingFamily.relationship_to_patient,
          phone_number: pendingFamily.phone_number,
          address: pendingFamily.address,
          patient_id: newPatient.patient_id,
        });

        // Remove pending family entry
        await PendingFamily.destroy({ where: { id: requestId } });
        
        return res.status(200).json({ message: 'Family approved successfully' });
      } else {
        return res.status(404).json({ message: 'Family request not found' });
      }
    } else {
      return res.status(400).json({ message: 'Invalid request type' });
    }
  } catch (error) {
    console.error('Error approving request:', error);
    return res.status(500).json({ message: 'Error approving request', error });
  }
});



  
  // Decline a request
  router.post('/admin/decline/:requestType/:requestId', async (req, res) => {
    const { requestType, requestId } = req.params;
  
    try {
      if (requestType === 'Caregiver') {
        // Handle declining a caregiver request
        const caregiverRequest = await PendingCaregiver.findByPk(requestId);
        if (caregiverRequest) {
          await PendingCaregiver.destroy({ where: { id: requestId } });
          return res.status(200).json({ message: 'Caregiver request declined successfully' });
        } else {
          return res.status(404).json({ message: 'Caregiver request not found' });
        }
      } else if (requestType === 'Family') {
        // Handle declining a family request
        const familyRequest = await PendingFamily.findByPk(requestId);
        if (familyRequest) {
          await PendingFamily.destroy({ where: { id: requestId } });
          return res.status(200).json({ message: 'Family request declined successfully' });
        } else {
          return res.status(404).json({ message: 'Family request not found' });
        }
      } else {
        return res.status(400).json({ message: 'Invalid request type' });
      }
    } catch (error) {
      console.error('Error declining request:', error);
      return res.status(500).json({ message: 'Error declining request', error });
    }
  });
  

module.exports = router;
