const express = require('express');
const router = express.Router();
const doctorAuth = require("../controller/doctors/doctorAuth");
const doctorController = require("../controller/doctors/doctorController");
const availabilityController = require("../controller/doctors/availability");





router.post("/editAvailability", availabilityController.editAvailability);
router.post("/doctorLogin", doctorAuth.doctorLogin);
router.post("/doctorSignUp", doctorAuth.doctorSignUp);
router.post("/doctorEditProfile", doctorController.editProfile);
router.post("/doctorEditPatientProfile", doctorController.editPatientProfile);
router.get("/doctorsInfo/:query", doctorAuth.getDoctorInfo);
router.delete("/deleteDoctor/:query", doctorController.deleteDoctor);
router.get("/doctorAvailability/:query", doctorController.getDoctorAvailability);
router.get("/allDoctors", doctorController.getAllDoctors);

module.exports = router;

