const express = require('express');
const router = express.Router();
const patientController = require("../controller/patients/patientsController");

router.post("/patientSignUp", patientController.patientSignUp);

module.exports = router;
