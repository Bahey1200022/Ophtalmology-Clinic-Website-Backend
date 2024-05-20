const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { hashPassword } = require("../utils/password");

const Schema = mongoose.Schema;

const billSchema = new mongoose.Schema({

    patientID: {
        type: String,
        required: false,
    },
    doctorID: {
        type: String,
        required: false,
    },
    patientName: {
        type: String,
        ref: "Patient",
        required: true,
    },
    doctorName: {
        type: String,
        ref: "Doctor",
        required: true,
    },

    billAmount: {
        type: Number,
        required: true,
    },

    insuranceCoverage: {
        type: Number,
        required: false,
    },
    billInsured: {
        type: Number,
        required: true,
    },
    service: {
        type: String,
        required: true,
    },
    adminName: {
        type: String,
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },

});

/**
 * Hashes the password before saving the user to the database.
 * @param {Function} next - Callback function.
 * @returns {Promise<void>} - Promise that resolves when hashing is done.
 * @throws {Error} - If there is an error hashing the password or saving the userPreferences.
 * @async
 */
billSchema.pre("save", async function (next) {
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
  
  const Bill = mongoose.model("Bill", billSchema);
  
  module.exports = Bill;