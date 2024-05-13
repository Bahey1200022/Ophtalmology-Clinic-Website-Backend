
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const brypt = require("bcrypt");
const Doctor = require("../../models/doctorModel");
require("dotenv").config();
const {
  generateToken,
  verifyToken,
} = require("../../utils/tokens");
const { comparePassword } = require("../../utils/password");

async function editAvailability(req, res) {
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const {name, days } = req.body;
  const user = await Doctor.findOne({ username:name });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Doctor not found",
    });
  
  }
if (!Array.isArray(days) || days.some(day => !["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].includes(day))) {
    return res.status(400).json({
        success: false,
        message: "Invalid days provided",
    });
}

  user.availableDays = days;
  await user.save();
  
  return res.status(200).json({
    success: true,
    message: "Doctor availability updated successfully",
  });
  }

  module.exports = {editAvailability};
