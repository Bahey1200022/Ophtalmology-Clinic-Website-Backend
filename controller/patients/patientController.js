const Patient = require("../../models/patientModel");
const Doctor = require("../../models/doctorModel");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
require("dotenv").config();
async function showRecords(req, res) {
  try {
    const { patientName } = req.body;
    const patient = await Patient.findOne({username: patientName});
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Records found",
      records: patient.record,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

async function patientInfo(req, res) {
  try {
    const name = req.params.query;
    const patient = await Patient.findOne({ username: name });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Patient found",
      patient: patient,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

async function deletePatient(req, res) {
  try {
    const name = req.params.query;
    const patient = await Patient.findOneAndDelete({ username: name });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Patient deleted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

// async function showRecords(req, res) {
//   try {
//     const name = req.params.query;
//     const patient = await Patient.findOne({ username: name });
//     if (!patient) {
//       return res.status(404).json({
//         success: false,
//         message: "Patient not found",
//       });
//     }
//     return res.status(200).json({
//       success: true,
//       message: "Records found",
//       records: patient.record,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//       error: error.message,
//     });
//   }
// }
module.exports = { showRecords, patientInfo, deletePatient };
