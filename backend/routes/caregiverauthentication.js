const express = require('express');
const bcrypt = require('bcrypt');
const { PendingCaregiver } = require('./models'); // Import PendingCaregiver model

app.use(express.json());

// Registration route for Caregiver
app.post('/register/caregiver', async (req, res) => {
  const { name, email, password, age, address, education } = req.body;

  // Check if email already exists in the PendingCaregiver table
  const existingCaregiver = await PendingCaregiver.findOne({ where: { email } });
  if (existingCaregiver) {
    return res.status(400).send('Caregiver with this email already exists in pending requests.');
  }

  // Create new pending caregiver record
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    const newPendingCaregiver = await PendingCaregiver.create({
      name,
      email,
      password: hashedPassword,
      age,
      address,
      education,
    });
    
    res.status(201).send('Caregiver registration request has been submitted for approval');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error registering caregiver');
  }
});
const { Caregiver, PendingCaregiver } = require('./models'); // Import both models
const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto'); // For generating a random password
const { Caregiver, PendingCaregiver } = require('./models');

const app = express();
app.use(express.json());

// Route to approve caregiver from pending requests
app.post('/approve/caregiver/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find pending caregiver by ID
    const pendingCaregiver = await PendingCaregiver.findOne({ where: { id } });

    if (!pendingCaregiver) {
      return res.status(404).send('Pending caregiver request not found');
    }

    // Generate a random password (you can adjust the length and complexity)
    const randomPassword = crypto.randomBytes(8).toString('hex'); // Generates a random 8-byte string

    // Hash the generated password
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // Create new caregiver in Caregiver table using the pending caregiver data
    const newCaregiver = await Caregiver.create({
      name: pendingCaregiver.name,
      email: pendingCaregiver.email,
      password: hashedPassword, // Store the hashed password
      age: pendingCaregiver.age,
      address: pendingCaregiver.address,
      education: pendingCaregiver.education,
    });

    // Optionally, send the generated password to the caregiver via email
    // (this requires an email service integration, which you can add if needed)

    // Delete the pending caregiver entry (or you could mark it as accepted)
    await PendingCaregiver.destroy({ where: { id } });

    res.status(200).send('Caregiver approved and registered successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error approving caregiver');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


// Login route for Caregiver
app.post('/login/caregiver', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find caregiver by email
    const caregiver = await Caregiver.findOne({ where: { email } });

    if (!caregiver) {
      return res.status(400).send('Caregiver not found');
    }

    // Compare password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, caregiver.password);

    if (!isPasswordValid) {
      return res.status(400).send('Invalid credentials');
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: caregiver.id, role: 'caregiver' }, // Payload with caregiver id and role
      'your_secret_key', // Secret key for signing the JWT
      { expiresIn: '1h' } // Set token expiration to 1 hour
    );

    // Send response with token
    res.status(200).send({ message: 'Caregiver logged in successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error logging in caregiver');
  }
});
