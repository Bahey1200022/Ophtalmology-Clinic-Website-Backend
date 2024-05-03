const express = require('express');
const router = express.Router();
const patientAuth = require("../controller/patients/patientAuth");
const patientController = require("../controller/patients/patientController");

router.post("/patientSignUp", patientAuth.patientSignUp);
router.post("/patientLogin", patientAuth.patientLogin);
router.get("/patientRecords", patientController.showRecords);

module.exports = router;
