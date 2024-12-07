const express = require('express');
const { PendingFamily, Family, Patient, Caregiver, sequelize } = require('./models');

const app = express();
app.use(express.json());

// Route for family to submit the form
app.post('/submit/family', async (req, res) => {
  const { name, email, relationship_to_patient, phone_number, address, 
          patient_name, patient_age, patient_medical_conditions, 
          patient_status, patient_emergency_contact } = req.body;

  try {
    // Create a new pending family request
    const newPendingFamily = await PendingFamily.create({
      name,
      email,
      relationship_to_patient,
      phone_number,
      address,
      patient_name,
      patient_age,
      patient_medical_conditions,
      patient_status,
      patient_emergency_contact,
    });

    res.status(201).send('Family registration request submitted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error submitting family registration request');
  }
});

// Route for admin to approve family registration request and assign a caregiver
app.post('/approve/family/:id', async (req, res) => {
  const familyRequestId = req.params.id;
  const { caregiver_id } = req.body;  // Caregiver selected by the admin

  // Check if caregiver_id is provided and valid
  if (!caregiver_id) {
    return res.status(400).send('Caregiver ID is required.');
  }

  // Fetch the PendingFamily request to get the family and patient details
  const pendingFamilyRequest = await PendingFamily.findOne({ where: { id: familyRequestId } });
  
  if (!pendingFamilyRequest) {
    return res.status(404).send('Pending family request not found.');
  }

  // Check if the caregiver exists
  const caregiver = await Caregiver.findOne({ where: { id: caregiver_id } });
  
  if (!caregiver) {
    return res.status(404).send('Caregiver not found.');
  }

  // Start a transaction to ensure that both the Family and Patient records are created
  const t = await sequelize.transaction();

  try {
    // Generate a random password for the family member
    const randomPassword = crypto.randomBytes(8).toString('hex'); // Generates a random 8-byte string

    // Hash the generated password
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // Move the PendingFamily data to the Family table and include the hashed password
    const newFamilyMember = await Family.create({
      name: pendingFamilyRequest.name,
      email: pendingFamilyRequest.email,
      relationship: pendingFamilyRequest.relationship_to_patient,
      phone_number: pendingFamilyRequest.phone_number,
      address: pendingFamilyRequest.address,
      password: hashedPassword, // Store the hashed password for the family member
    }, { transaction: t });

    // Create a new Patient record and assign the selected caregiver to the patient
    const newPatient = await Patient.create({
      name: pendingFamilyRequest.patient_name,  // assuming patient_name is stored in the pending family request
      age: pendingFamilyRequest.patient_age,
      medical_conditions: pendingFamilyRequest.patient_medical_conditions,
      status: pendingFamilyRequest.patient_status,
      emergency_contact: pendingFamilyRequest.patient_emergency_contact,
      assigned_caregiver_id: caregiver.id, // Assign caregiver to the patient
    }, { transaction: t });

    // Commit the transaction to save all changes
    await t.commit();

    // Remove the approved request from PendingFamily
    await PendingFamily.destroy({ where: { id: familyRequestId } });

    // Optionally, you could send the generated password to the family member via email

    // Send a response indicating success
    res.status(200).send('Family member registered and caregiver assigned to patient successfully');
  } catch (error) {
    // Rollback the transaction in case of error
    await t.rollback();
    console.error(error);
    res.status(500).send('Error processing the family member registration and caregiver assignment');
  }
});


const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Login route for Admin or Caregiver
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the email belongs to a Caregiver or Admin
    let user = await Caregiver.findOne({ where: { email } });

    if (!user) {
      // If no caregiver is found, check if it's an Admin (assuming admin is another model)
      user = await Admin.findOne({ where: { email } });

      if (!user) {
        return res.status(400).send('User not found');
      }
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).send('Invalid credentials');
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user.id, role: user.role }, 'your_secret_key', { expiresIn: '1h' });

    // Return the token in the response
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error during login');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
