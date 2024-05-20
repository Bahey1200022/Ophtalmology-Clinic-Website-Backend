const Patient = require("../../models/patientModel");
const Doctor = require("../../models/doctorModel");
const Appointment = require("../../models/appointmentModel");
const Bill = require("../../models/billModel");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
require("dotenv").config();
async function showRecords(req, res) {
  try {
    const patientName = req.params.query;
    const patient = await Patient.findOne({ username: patientName });
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

async function showAllRecords(req, res) {
  try {
    const patients = await Patient.find({});
    if (!patients || patients.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No patients found",
      });
    }
    let allRecords = [];
    patients.forEach((patient) => {
      allRecords = allRecords.concat(patient.record);
    });
    return res.status(200).json({
      success: true,
      message: "All records found",
      records: allRecords,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}
async function getAllPatients(req, res) {
  try {
    const patients = await Patient.find({});
    if (!patients || patients.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No patients found",
      });
    }
    const usernames = patients.map((patient) => patient.username); // Extracting usernames
    return res.status(200).json({
      success: true,
      message: "All patients found",
      patients: usernames, // Sending only usernames
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

async function getMyAppointments(req, res) {
  try {
    const { patientName } = req.params;
    const patient = await Patient.findOne({ username: patientName });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }
    const appointments = await Appointment.find({ patient: patient._id });
    if (!appointments || appointments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No appointments found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Appointments found",
      appointments: appointments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

async function getBills(req, res) {
  try {
    const { username } = req.params;
    const bill = await Bill.findOne({ patientName: username });
    if (!bill || bill.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No bills found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Bills found",
      bills: bill,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}
async function markBillAsPaid(req, res) {
  try {
    const { billID } = req.params;
    // Use findById with billID directly
    const bill = await Bill.findById(billID);
    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found",
      });
    }
    bill.isPaid = true;
    await bill.save();
    return res.status(200).json({
      success: true,
      message: "Bill marked as paid",
      bill: bill,
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
  showRecords,
  patientInfo,
  deletePatient,
  showAllRecords,
  getAllPatients,
  getMyAppointments,
  getBills,
  markBillAsPaid,
};
