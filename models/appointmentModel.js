const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AppointmentSchema = new Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  doctorName: {
    type: String,
    ref: "Doctor",
    required: true,
  },
  patientName: {
    type: String,
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
  },
  isDone: {
    type: Boolean,
    default: false,
  },
  Service: {
    type: String,
    required: false,
    enum: ["Glasses", "Contact Lenses", "Surgery", "Lasik", "Cataract"],
  },
  queueNumber: {
    type: Number,
    required: true,
  },
});

const Appointment = mongoose.model("Appointment", AppointmentSchema);

module.exports = Appointment;
