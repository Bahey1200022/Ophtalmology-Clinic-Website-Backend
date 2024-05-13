const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { hashPassword } = require("../utils/password");

const Schema = mongoose.Schema;

const patientSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  patientName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  DOB: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: true,
  },
  Insurance: {
    type: String,
    required: false,
    enum: ["MidRight", "Allianz", "MidMark"],
  },
  ChronicDisease: {
    type: String,
    required: false,
  },

  record: [{
    
    RT: {
        SPH: {
          type: String,
        },
        cyl: {
          type: String,
        },
        axis: {
          type: String,
        },
        reading: {
          type: String,
        },
      },
    LT: {
        SPH: {
          type: String,
        },
        cyl: {
          type: String,
        },
        axis: {
          type: String,
        },
        reading: {
          type: String,
        },
      },
    date: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
    },
    doctor: {
      type: String,
      ref: "Doctor",
      required: true,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  appointments: [
    {
      doctor: {
        type: Schema.Types.ObjectId,
        ref: "Doctor",
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
      time: {
        type: String,
        required: true,
      },
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

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
