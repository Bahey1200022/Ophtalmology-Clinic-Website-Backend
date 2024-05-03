const express = require('express');
const router = express.Router();
const doctorController = require("../controller/doctors/doctorAuth");
const availabilityController = require("../controller/doctors/availability");



router.post("/doctorLogin", doctorController.doctorLogin);
router.post("/doctorSignUp", doctorController.doctorSignUp);
router.post("/editAvailability", availabilityController.editAvailability);

module.exports = router;

