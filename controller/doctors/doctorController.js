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
    const { patientId, record, chronicDisease, doctor } = req.body;

    const patient = await Patient.findById(patientId);
    const doctorname = await Doctor.findOne({ name: doctor });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }
    if (!doctorname) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const newRecord = {
      RT: record.RT || [],
      LT: record.LT || [],
      date: record.date || new Date(),
      notes: record.notes || "",
      doctorname: record.doctor || "",
    };

    if (doctorname) {
      newRecord.doctor = doctorname.name;
    }

    if (chronicDisease) {
      patient.ChronicDisease = chronicDisease;
    }

    patient.record.push(newRecord);

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


async function deleteDoctor(req, res) {
  try {
    const name  = req.params.query;
    const doctor = await Doctor.findOneAndDelete({name});
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Doctor deleted successfully",
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
  deleteDoctor,
}
