const Patient = require("../../models/patientModel");
const Doctor = require("../../models/doctorModel");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
require("dotenv").config();

async function editProfile(req, res) {
  try {
    const { doctorId, name, email, phone, address } = req.body;
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }
    doctor.name = name;
    doctor.email = email;
    doctor.phone = phone;
    doctor.address = address;
    await doctor.save();
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}


async function editPatientProfile(req, res) {
  try {
    const { patientId, records, chronicDisease } = req.body;

    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

   if (records) {
     if (records.RT) {
       patient.record.RT.push(...records.RT);
     }
     if (records.LT) {
       patient.record.LT.push(...records.LT);
     }
   }
    if (chronicDisease) {
      patient.ChronicDisease = chronicDisease;
    }

    await patient.save();

    return res.status(200).json({
      success: true,
      message: "Patient profile updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}




module.exports = {
  editProfile,
  editPatientProfile,
};
