const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { hashPassword } = require("../utils/password");

const Schema = mongoose.Schema;

const doctorSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    default: false,
  },
  doctorName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    default: false,
  },
  password: {
    type: String,
    default: false,
  },
  Speciality: {
    type: String,
    default: false,
  },
  phone: {
    type: String,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  gender: {
    type: String,
    default: false,
  },
  fees: {
    type: Number,
    required: true,
  },
  availableDays: [
    {
      type: String,
      required: true,
    },
  ],
  availableTime: [
    {
      type: String,
      required: true,
    },
  ],
  appointments: [
    {
      patient: {
        type: Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
      },
      date: {
        type: String,
        required: true,
      },
      time: {
        type: String,
        required: true,
      }
    },
  ],
});
/**
 * Hashes the password before saving the user to the database.
 * @param {Function} next - Callback function.
 * @returns {Promise<void>} - Promise that resolves when hashing is done.
 * @throws {Error} - If there is an error hashing the password or saving the userPreferences.
 * @async
 */
doctorSchema.pre("save", async function (next) {
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

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
