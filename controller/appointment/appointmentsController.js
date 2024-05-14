const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
require("dotenv").config();
const { verifyToken } = require("../../utils/tokens");
const Doctor = require("../../models/doctorModel");
const Patient = require("../../models/patientModel");
const Appointment = require("../../models/appointmentModel");

const { v4: uuidv4 } = require("uuid");

async function createAppointment(req, res) {
  try {
    // Validate input data
    const { patientName, doctorName, date, time, Service } = req.body;
    if (!patientName || !doctorName || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Patient name, doctor name, date, and time are required",
      });
    }

    // Find patient and doctor
    const patient = await Patient.findOne({ username: patientName });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    const doctor = await Doctor.findOne({ username: doctorName });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Check if the doctor is available on the specified date
    const appointmentDay = date;
    if (!doctor.availableDays.includes(appointmentDay)) {
      return res.status(400).json({
        success: false,
        message: "Doctor is not available on the specified date",
      });
    }

    // Validate time
    const validTimes = ["Morning", "Afternoon", "Evening"];
    if (!validTimes.includes(time)) {
      return res.status(400).json({
        success: false,
        message: "Invalid time provided",
      });
    }

    // Check if the doctor is available at the specified time
    if (!doctor.availableTime.includes(time)) {
      return res.status(400).json({
        success: false,
        message: "Doctor is not available at the specified time",
      });
    }

    // Get the current queue number for the patient
    const queueNumber = doctor.appointments.length + 1;

    // Create appointment instance
    const appointment = new Appointment({
      doctor: doctor._id,
      patient: patient._id,
      doctorName: doctor.username,
      patientName: patient.username,
      date,
      time,
      Service,
      isDone: false,
      queueNumber,
    });

    await appointment.save();

    // Push the appointment into the doctor's and patient's appointments
    doctor.appointments.push(appointment);
    patient.appointments.push(appointment);
    await doctor.save();
    await patient.save();

    return res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      appointment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}


async function getAllAppointments(req, res) {
  try {
    const { type } = req.params;
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Username is required in the request body.",
      });
    }

    let filter = {};
    let userModel;
    switch (type) {
      case "patient":
        filter.patientName = username;
        userModel = Patient;
        break;
      case "doctor":
        filter.doctorName = username;
        userModel = Doctor;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid type. Type must be 'patient' or 'doctor'.",
        });
    }

    const user = await userModel.findOne({ username: username });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `${type} not found`,
      });
    }

    const appointments = await Appointment.find(filter);

    return res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

async function getAvailableTimeSlots(req, res) {
  try {
    const doctors = await Doctor.find();
    const availableTimeSlots = doctors
      .map((doctor) => {
        return {
          doctorName: doctor.username,
          timeSlots: doctor.availableDays,
          time: doctor.availableTime,

        };
      })
      .flat();

    return res.status(200).json({
      success: true,
      availableTimeSlots,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

  async function markDone(req, res) {
    try {
      const { _id } = req.body
      const appointment = await Appointment.findById(_id);

      if (!appointment) {
        return res.status(400).json({
          success: false,
          message: "Appointment not found",
        });
      }

      // Update an attribute in the appointment
      appointment.isDone = true;
      await appointment.save();

      return res.status(200).json({
        success: true,
        message: "Appointment attribute updated successfully",
        appointment,
      });


    }
    catch (error) {
      console.error(error);
      return res.status(400).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
async function editAppointment(req, res) {
  try {
    const { appointmentId, newDate, newTime, patientName, doctorName } =
      req.body;

    // Validate input parameters
    if (!appointmentId || (!newDate && !newTime) || !doctorName) {
      return res.status(400).json({
        success: false,
        message:
          "Appointment ID, doctorName, and either newDate or newTime are required",
      });
    }

    // Find the appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Find the doctor
    const doctor = await Doctor.findOne({ username: doctorName });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Update appointment's date if new date is provided
    if (newDate && newDate !== appointment.date) {
      appointment.date = newDate;
    }

    // Update appointment's time if new time is provided
    if (newTime && newTime !== appointment.time) {
      appointment.time = newTime;
    }

    // Check doctor's availability at the new date and time
    if (newDate && newTime) {
      if (!doctor.availableDays.includes(newDate)) {
        return res.status(400).json({
          success: false,
          message: "Doctor is not available on the specified date",
        });
      }

      if (!doctor.availableTime.includes(newTime)) {
        return res.status(400).json({
          success: false,
          message: "Doctor is not available at the specified time",
        });
      }
    }

    // Calculate queue number
    const queueNumber = doctor.appointments.length + 1;
    appointment.queueNumber = queueNumber;

    // Save the updated appointment
    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      appointment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}



async function cancelAppointment(req, res) {
  try {
    const appointmentId = req.params.id;

    // Find the appointment
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Find the doctor and patient and remove the appointment from their appointments array
    const doctor = await Doctor.findById(appointment.doctor);
    const patient = await Patient.findById(appointment.patient);

    if (doctor) {
      doctor.appointments = doctor.appointments.filter(
        (app) => app._id.toString() !== appointmentId
      );
      await doctor.save();
    }

    if (patient) {
      patient.appointments = patient.appointments.filter(
        (app) => app._id.toString() !== appointmentId
      );
      await patient.save();
    }

    await Appointment.findByIdAndDelete(appointmentId);

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}


async function getAllAppointments(req, res) {
  try {
    const appointments = await Appointment.find();
    return res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = {
  createAppointment,
  getAllAppointments,
  getAvailableTimeSlots,
  editAppointment,
  markDone,
  cancelAppointment,
  getAllAppointments,

};
