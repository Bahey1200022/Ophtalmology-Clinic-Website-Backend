const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
require("dotenv").config();
const { verifyToken } = require("../../utils/tokens");
const Doctor = require("../../models/doctorModel");
const Patient = require("../../models/patientModel");
const Appointment = require("../../models/appointmentModel");
const Bill = require("../../models/billModel");
async function GenerateBill(req, res) {
  try {
    const { appointmentID } = req.body;
    const appointment = await Appointment.findById(appointmentID);
    if (!appointment) {
      return res.status(400).json({
        success: false,
        message: "Appointment not found",
      });
    }
    const patient = await Patient.findById(appointment.patient);
    const doctor = await Doctor.findById(appointment.doctor);
    const patientInsurance = patient.Insurance;
    console.log(patientInsurance);
    const patientService = appointment.Service;
    var percentage = 0;
    var bill = 0;
    if (patientInsurance == "MidRight") {
      percentage = 0.25;
    } else if (patientInsurance == "Allianz") {
      percentage = 0.5;
    } else if (patientInsurance == "MidMark") {
      percentage = 0.75;
    } else {
      percentage = 0;
    }
    console.log(percentage);
    if (patientService == "Glasses") {
      bill = 200;
    } else if (patientService == "Contact Lenses") {
      bill = 300;
    } else if (patientService == "Surgery") {
      bill = 500;
    } else if (patientService == "Lasik") {
      bill = 400;
    }
    const discount = bill * percentage;
    console.log(discount);
    const finalBill = bill - discount;
    const newBill = new Bill({
      patientID: patient._id,

      doctorID: doctor._id,
      patientName: patient.username,
      doctorName: doctor.username,
      billAmount: bill,
      insuranceCoverage: discount,
      billInsured: finalBill,
      service: patientService,
      adminName: "Admin",
      createdAt: new Date(),
    });

    const savedBill = await newBill.save();

    return res.status(200).json({
      success: true,
      message: "Bill generated successfully",
      bill: savedBill,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}
module.exports = { GenerateBill };
