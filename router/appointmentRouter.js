const express = require('express');
const router = express.Router();
const appointmentController = require("../controller/appointment/appointmentsController");

router.get("/appointments", appointmentController.getAvailableTimeSlots);
router.post("/createAppointment", appointmentController.createAppointment);
router.get("/appointments/history/:type", appointmentController.getAllAppointments);
router.post("/appointments/edit", appointmentController.editAppointment);           

module.exports = router;
