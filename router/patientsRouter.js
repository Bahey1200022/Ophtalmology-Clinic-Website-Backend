const express = require('express');
const router = express.Router();
const patientController = require("../controller/patients/patientAuth");

router.post("/patientSignUp", patientController.patientSignUp);
router.post("/patientLogin", patientController.patientLogin);

module.exports = router;
