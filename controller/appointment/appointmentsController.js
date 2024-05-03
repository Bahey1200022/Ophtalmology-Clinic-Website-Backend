const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
require("dotenv").config();
const { verifyToken } = require("../../utils/tokens");
const Doctor = require("../../models/doctorModel");
const Patient = require("../../models/patientModel");
const Appointment = require("../../models/appointmentModel");

// async function createAppointment(req, res) {
//   try {
  //     const { patientName, doctorName, date, time } = req.body;

//     // const token = req.headers.authorization.split(" ")[1];

//     // const decoded = await verifyToken(token);
//     // if (!decoded) {
//     //   return res.status(401).json({
//     //     success: false,
//     //     message: "Unauthorized",
//     //   });
//     // }

//     //  const patient = await Patient.findById(decoded.patientId);
//     //  if (!patient) {
//     //    return res
//     //      .status(404)
//     //      .json({ success: false, message: "Patient not found" });
//     //  }

// const patient = await Patient.findOne({ name: patientName });
// if (!patient) {
//   return res.status(404).json({
//     success: false,
//     message: "Doctor not found",
//   });
// }
//     // Find the doctor by name (assuming doctorName is the doctor's name)
//     const doctor = await Doctor.findOne({ name: doctorName });
//     if (!doctor) {
//       return res.status(404).json({
//         success: false,
//         message: "Doctor not found",
//       });
//     }

//     // Create the appointment object
//     const appointment = {
//       doctor: doctor._id,
//       patient: patient._id,
//       date,
//       time,
//     };

//     doctor.patientappoinment.push(appointment);

//     patient.doctorappoinment.push(appointment);

//     await doctor.save();
//     await patient.save();

//     return res.status(201).json({
//       success: true,
//       message: "Appointment created successfully",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// }
async function createAppointment(req, res) {
  try {
    // Validate input data
    const { patientName, doctorName, date, time } = req.body;
    if (!patientName || !doctorName || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Patient name, doctor name, date, and time are required",
      });
    }

    // Find patient and doctor
    const patient = await Patient.findOne({ name: patientName });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    const doctor = await Doctor.findOne({ name: doctorName });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Check if appointment has been done before
    const previousAppointment = await Appointment.findOne({
      doctor: doctor._id,
      patient: patient._id,
      date,
      isDone: true, 
    });

    if (previousAppointment) {
      return res.status(400).json({
        success: false,
        message: "Appointment has already been completed",
      });
    }

    const appointment = {
      doctor: {
        _id: doctor._id,
        name: doctor.name,
      },
      patient: {
        _id: patient._id,
        name: patient.name,
      },
      date,
      time,
      isDone: false, 
    };

    doctor.appointments.push(appointment);
    patient.appointments.push(appointment);
    await doctor.save();
    await patient.save();
    // Create appointment instance
    const appointment1 = new Appointment({
      doctor: doctor._id,
      patient: patient._id,
      doctorName: doctor.name,
      patientName: patient.name,
      date,
      time,
      isDone: false, 
    });

    await appointment1.save();

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

    const user = await userModel.findOne({ name: username });
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
  try{
    const doctors = await Doctor.find();
    const availableTimeSlots = doctors.map(doctor => {
      return {
      doctorName: doctor.name,
      timeSlots: doctor.availableDays
      };
    }).flat();

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
  try{
const{ _id}=req.body
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


module.exports = {
  createAppointment,
getAllAppointments,
getAvailableTimeSlots,
markDone
};
