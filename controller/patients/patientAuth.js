const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const brypt = require("bcrypt");
const Patient = require("../../models/patientModel");
require("dotenv").config();
const { generateToken, verifyToken } = require("../../utils/tokens");
const { comparePassword } = require("../../utils/password");
const mail = require("../../utils/mailHandler");
async function patientExist(req, res) {
  const { name } = req.params;
  const user = await Patient.findOne({ username: name });
  try {
    if (user) {
      return res.status(409).json({
        success: false,
        message: "Username already exists",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Username is available",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function patientSignUp(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const {
    username,
    patientName,
    email,
    password,
    DOB,
    gender,
    phone,
    Insurance,
    ChronicDisease,
  } = req.body;
  try {
    let emailExist = await Patient.findOne({ email });
    if (emailExist) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }
    let userExist = await Patient.findOne({ username });
    if (userExist) {
      return res.status(409).json({
        success: false,
        message: "Username already exists",
      });
    }

    const user = new Patient({
      username,
      patientName,
      email,
      password,
      DOB,
      gender,
      phone,
      Insurance,
      ChronicDisease,
    });
    //save user to database
    await user.save();

    const emailHTML = `
    <html>
      <body>
        <h1>Welcome to Our Clinic!</h1>
        <p>
          <strong>Username:</strong> ${username}<br>
          <strong>Password:</strong> ${password}
        </p>
        <p>Please do not share this information with anyone.</p>
      </body>
    </html>
    `;
    const emailSubject = "Verify your email address to the clinic";

    await mail({
      email: email,
      subject: emailSubject,
      text: emailHTML,
    });
    //send verification email
    const token = await generateToken(user._id);

    //logins user
    const accessToken = await generateToken(user._id);

    //status
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function patientLogin(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { username, password } = req.body;
  const user = await Patient.findOne({ username: username });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Invalid credentials, check username or password",
    });
  }
  //compare password
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials, check username or password",
    });
  }
  //generate token
  const accessToken = await generateToken(user._id);
  return res.status(200).json({
    success: true,
    message: "Login successful",
    accessToken,
  });
}

module.exports = {
  patientSignUp,
  patientExist,
  patientLogin,
};
