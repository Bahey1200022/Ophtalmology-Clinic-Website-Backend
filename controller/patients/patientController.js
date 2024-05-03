const Patient = require("../../models/patientModel");
const Doctor = require("../../models/doctorModel");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
require("dotenv").config();
async function showRecords(req, res) {
    try {
        const { patientId } = req.body;
        const patient = await Patient.findById(patientId);
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
}
module.exports = { showRecords };
