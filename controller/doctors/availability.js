const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const Doctor = require("../../models/doctorModel");
require("dotenv").config();
const { generateToken, verifyToken } = require("../../utils/tokens");
const { comparePassword } = require("../../utils/password");

async function editAvailability(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

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
  if (!Array.isArray(time) || time.some((t) => !/^\d{1,2}-\d{1,2}$/.test(t))) {
    return res.status(400).json({
      success: false,
      message: "Invalid time format provided. Use 'HH-HH' format.",
    });
  }

  const parsedTimes = time.map((t) => {
    const [start, end] = t.split("-").map(Number);
    if (start >= 0 && start < 24 && end > 0 && end <= 24 && start < end) {
      return { start, end };
    } else {
      return null;
    }
  });

  if (parsedTimes.includes(null)) {
    return res.status(400).json({
      success: false,
      message: "Invalid time range provided.",
    });
  }

  // Update doctor's availability
  user.availableDays = days;
  user.availableTime = parsedTimes;

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Doctor availability updated successfully",
  });
}

module.exports = { editAvailability };
