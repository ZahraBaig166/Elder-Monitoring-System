const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { PendingFamily, Family, Patient, PendingCaregiver, Caregiver, Query,sequelize } = require('../models');
const {patient} = require('../models/patient');
const jwt = require('jsonwebtoken');
const { send } = require('process');
const router = express.Router();
require('dotenv').config();
router.use(express.json());

router.post('/admin/queries', async (req, res) => {
  try {
    console.log("hello, I'm in queries");

    const { userId, type } = req.body;
    console.log(type);

    // Fetch all unresolved queries from the database
    const queries = await Query.findAll({
      where: {
        is_resolved: false, // Only unresolved queries
      }
    });

    // If a type is provided in the body, filter queries based on recipient type
    if (type) {
      // Compare the `type` to the `recipient` field (adjust according to your schema)
      const filteredQueries = queries.filter(query => query.recepient === type);

      console.log("Filtered unresolved queries based on type:", filteredQueries);

      return res.json({ success: true, data: filteredQueries });
    }

    // If no type is provided, return all unresolved queries
    console.log("Fetched unresolved queries without type filtering:", queries);
    return res.json({ success: true, data: queries });

  } catch (error) {
    console.error('Error fetching queries:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch queries' });
  }
});



router.post('/admin/allqueries', async (req, res) => {
  try {
 

    const { userId,sender_type } = req.body;
    console.log(sender_type);

    // Fetch all unresolved queries from the database
    const queries = await Query.findAll({
      where: {
        sender_id: userId,
        sender_type: sender_type,
      }
    });
    console.log(queries);
    return res.json({ success: true, data: queries });

  } catch (error) {
    console.error('Error fetching queries:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch queries' });
  }
});


router.post('/admin/allfamily', async (req, res) => {
  try {

    const { sender_id,sender_type } = req.body;

    // Fetch all unresolved queries from the database
    const queries = await Query.findAll({
      where: {
        sender_id: sender_id,
        sender_type: sender_type,
      }
    });
    console.log(queries);
    return res.json({ success: true, data: queries });

  } catch (error) {
    console.error('Error fetching queries:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch queries' });
  }
});


router.patch('/admin/queries_respond', async (req, res) => {
  const { query_id, response } = req.body;
  console.log("from routes",query_id);
  console.log(response);

  if (!query_id || !response) {
    return res.status(400).json({ success: false, message: 'Query ID and response are required' });
  }

  try {
    // Find the query by ID
    const query = await Query.findByPk(query_id);

    if (!query) {
      return res.status(404).json({ success: false, message: 'Query not found' });
    }

    // Update the query with the response and mark it as resolved
    await query.update({
      is_resolved: true,
      response: response, // Add the response to the query
    });

    return res.status(200).json({ success: true, message: 'Query marked as resolved and response stored' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error updating query status and storing response' });
  }
});
router.get('/admin/users', async (req, res) => {
  try {
    // Fetch data from the database
    const caregivers = await Caregiver.findAll(); 
    const family = await Family.findAll(); 
    console.log("this is caregiver",caregivers);
    console.log("this is family",family);
    // Combine the data into a single response object
    return res.status(200).json({ caregivers,family});

    // Send the response
    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



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

  const token = jwt.sign({ email }, "secret", { expiresIn: '1h' }); // Adjust expiration as needed

  return res.status(200).json({ message: 'Login successful' ,token});
});

  router.get('/admin/pending', async (req, res) => {
    try {
      // Declare pendingFamilies outside the try block
      let pendingFamilies = [];
      let pendingCaregivers = [];
      console.log("hello");
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
    const caregivers = await Caregiver.findAll(); 
    

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
const nodemailer = require('nodemailer'); // Add this for sending emails

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service
  auth: {
    user: 'laibar1002@gmail.com', // Replace with your email
    pass: 'tawq zmns rfxx kuur', // Replace with your email password or app-specific password
  },
});

router.post('/admin/approve/:requestType/:requestId', async (req, res) => {
  const { requestType, requestId } = req.params;
  try {
    if (requestType === 'Caregiver') {
      const pendingCaregiver = await PendingCaregiver.findByPk(requestId);
      if (pendingCaregiver) {
        const randomPassword = crypto.randomBytes(3).toString('hex');
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        const newCaregiver = await Caregiver.create({
          name: pendingCaregiver.name,
          email: pendingCaregiver.email,
          password: randomPassword,
          age: pendingCaregiver.age,
          address: pendingCaregiver.address,
          education: pendingCaregiver.education,
        });

        await PendingCaregiver.destroy({ where: { id: requestId } });

        // Send email to caregiver
        const mailOptions = {
          from: 'laibar1002@gmail.com',
          to: pendingCaregiver.email,
          subject: 'Account Approved - Caregiver',
          text: `Dear ${pendingCaregiver.name},\n\nYour account has been approved.\n\nHere is your auto-generated password: ${randomPassword}\n\nPlease login.\n\nThank you.`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
          } else {
            console.log('Email sent:', info.response);
          }
        });

        return res.status(200).json({ message: 'Caregiver approved and registered successfully' });
      } else {
        return res.status(404).json({ message: 'Caregiver request not found' });
      }
    } else if (requestType === 'Family') {
      const pendingFamily = await PendingFamily.findByPk(requestId);
      if (pendingFamily) {
        const randomPassword = crypto.randomBytes(3).toString('hex');
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        const newPatient = await Patient.create({
          name: pendingFamily.patient_name,
          age: pendingFamily.patient_age,
          medical_conditions: pendingFamily.patient_medical_conditions,
          emergency_contact: pendingFamily.patient_emergency_contact,
          status: pendingFamily.patient_status,
        });

        const newFamily = await Family.create({
          name: pendingFamily.name,
          email: pendingFamily.email,
          password: randomPassword, // Save the random password as plain text
          relationship: pendingFamily.relationship_to_patient,
          phone_number: pendingFamily.phone_number,
          address: pendingFamily.address,
          patient_id: newPatient.patient_id,
        });

        await PendingFamily.destroy({ where: { id: requestId } });

        // Send email to family
        const mailOptions = {
          from: 'laibar1002@gmail.com',
          to: pendingFamily.email,
          subject: 'Account Approved - Family',
          text: `Dear ${pendingFamily.name},\n\nYour account has been approved.\n\nHere is your auto-generated password: ${randomPassword}\n\nPlease login.\n\nThank you.`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
          } else {
            console.log('Email sent:', info.response);
          }
        });

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
  router.get("/admin/users/:userType/:userId", async (req, res) => {
    const { userType, userId } = req.params;
  
    console.log("Received userType:", userType);
    console.log("Received userId:", userId);
  
    // Check for missing parameters
    if (!userType || !userId) {
      return res.status(400).json({ message: "User type or ID is missing." });
    }
  
    try {
      let user = null;
  
      // Fetch data based on user type using findByPk
      if (userType === "Caregiver") {
        console.log("Fetching Caregiver details...");

        user = await Caregiver.findByPk(userId, {
          attributes: ["user_id", "name", "email", "age", "address", "education", "date_created"],
        });
        console.log("user",user);

      } else if (userType === "Family") {
        console.log("Fetching Family details...");
        user = await Family.findByPk(userId, {
          attributes: ["user_id", "name", "email", "relationship", "address", "patient_id"],
        });
      } else {
        return res.status(400).json({ message: "Invalid user type. Use 'Caregiver' or 'Family'." });
      }
  
      // Check if user exists
      if (!user) {
        console.log("User not found.");
        return res.status(404).json({ message: "User not found." });
      }
  
      // Return user details
      console.log("User found:", user);
      return res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user details:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  });
module.exports = router;
