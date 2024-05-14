const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Doctor = require("../../models/doctorModel");
require("dotenv").config();
const { generateToken, verifyToken } = require("../../utils/tokens");
const { comparePassword } = require("../../utils/password");

async function editAvailability(req, res) {
  
  const { name, days, time } = req.body;

  // Find the doctor by username
  const user = await Doctor.findOne({ username: name });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Doctor not found",
    });
  }

  // Validate the 'days' array
  if (
    !Array.isArray(days) ||
    days.some(
      (day) =>
        ![
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ].includes(day)
    )
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid days provided",
    });
  }

  // Validate and parse the 'time' array
  if (
    !Array.isArray(time) ||
    time.some((time) => !["Morning", "Afternoon", "Evening"].includes(time))
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid time provided",
    });
  }
  // Update doctor's availability
  user.availableDays = days;
  user.availableTime = time;
 

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Doctor availability updated successfully",
  });
}

module.exports = { editAvailability };
