const express = require('express');
const router = express.Router();
const appointmentController = require("../controller/appointment/appointmentsController");

router.get("/appointments", appointmentController.getAvailableTimeSlots);
router.post("/createAppointment", appointmentController.createAppointment);
router.get("/appointments/history/:type", appointmentController.getAllAppointments);

module.exports = router;
