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

    const patient = await Patient.findOne({username: name });
    if (patient) {
      return res.status(200).json({
        success: true,
        message: "Patient found",
        user: patient.name,
      });
    }

    const doctor = await Doctor.findOne({ username: name });
    if (doctor) {
      return res.status(200).json({
        success: true,
        message: "Doctor found",
        user: doctor.name,
      });
    }

    const admin = await Admin.findOne({ username: name});
    if (admin) {
      return res.status(200).json({
        success: true,
        message: "Admin found",
        user: admin.username,
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
