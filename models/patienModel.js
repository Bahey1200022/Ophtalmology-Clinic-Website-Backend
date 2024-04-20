const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { hashPassword } = require("../../utils/passwords");

//create patient schema for reddit user
const patientSchema = new mongoose.Schema({
  patientname: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash the password before saving the patient to the database
patientSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const hashedPassword = await hashPassword(this.password);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Patient", patientSchema);
