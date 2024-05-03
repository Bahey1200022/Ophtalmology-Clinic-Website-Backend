const express = require('express');
const router = express.Router();
const doctorAuth = require("../controller/doctors/doctorAuth");
const doctorController = require("../controller/doctors/doctorController");


router.post("/doctorLogin", doctorAuth.doctorLogin);
router.post("/doctorSignUp", doctorAuth.doctorSignUp);
router.post("/doctorEditProfile", doctorController.editProfile);
router.post("/doctorEditPatientProfile", doctorController.editPatientProfile);

module.exports = router;

