const Patient = require("../models/patientModel");
const Doctor = require("../models/doctorModel");
const Admin = require("../models/adminModel");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { patientInfo } = require("./patients/patientController");
require("dotenv").config();

async function CheckMe(req, res) {
  try {
    const { name } = req.body;

    // Check if the user is a patient
    const patient = await Patient.findOne({ username: name });
    if (patient) {
      return res.status(200).json({
        success: true,
        message: "Patient found",
        username: patient.username, 
      });
    }

    // Check if the user is a doctor
    const doctor = await Doctor.findOne({ username: name });
    if (doctor) {
      return res.status(200).json({
        success: true,
        message: "Doctor found",
        username: doctor.username, // Access doctorName field for doctor
      });
    }

    // Check if the user is an admin
    const admin = await Admin.findOne({ username: name });
    if (admin) {
      return res.status(200).json({
        success: true,
        message: "Admin found",
        username: admin.username,
      });
    }

    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

module.exports = { CheckMe };
