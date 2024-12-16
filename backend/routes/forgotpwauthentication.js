const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const { Family, Caregiver } = require("../models"); 
const router = express.Router();

router.use(bodyParser.json());

const verificationStore = {};


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "laibar1002@gmail.com",
    pass: "tawq zmns rfxx kuur",
  },
});

const generateVerificationCode = () =>
    Math.floor(1000 + Math.random() * 9000).toString();


router.post("/forgot-password/sendcode", async (req, res) => {
  const { email } = req.body;

  try {
    
    const user =
      (await Family.findOne({ where: { email } })) ||
      (await Caregiver.findOne({ where: { email } }));

    if (!user) {
      return res.status(404).json({ message: "Email not found." });
    }

  
    const verificationCode = generateVerificationCode();
    verificationStore[email] = verificationCode;

    console.log(`Generated Code: ${verificationCode} for email: ${email}`);

    await transporter.sendMail({
      from: "laibar1002@gmail.com",
      to: email,
      subject: "Password Reset Verification Code",
      text: `Your verification code is: ${verificationCode}`,
    });

    return res.status(200).json({ message: "Verification code sent to email." });
  } catch (error) {
    console.error("Error in /forgot-password/sendcode:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});


router.post("/verify-code", async (req, res) => {
  const { email, code } = req.body;

  try {
   
    if (verificationStore[email] !== code) {
      return res.status(400).json({ message: "Invalid verification code." });
    }

   
    delete verificationStore[email];

    return res.status(200).json({ message: "Verification code verified successfully." });
  } catch (error) {
    console.error("Error in /verify-code:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});


router.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user =
      (await Family.findOne({ where: { email } })) ||
      (await Caregiver.findOne({ where: { email } }));

    if (!user) {
      return res.status(404).json({ message: "Email not found." });
    }

    const bcrypt = require("bcrypt");
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Error in /reset-password:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
