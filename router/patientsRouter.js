const express = require('express');
const router = express.Router();
const patientAuth = require("../controller/patients/patientAuth");
const patientController = require("../controller/patients/patientController");

router.post("/patientSignUp", patientAuth.patientSignUp);
router.post("/patientLogin", patientAuth.patientLogin);
router.get("/patientRecords/:query", patientController.showRecords);
router.get("/patientInfo/:query", patientController.patientInfo);
router.delete("/deletePatient/:query", patientController.deletePatient);
router.get("/allPatients", patientController.getAllPatients);
router.get("/allRecords", patientController.showAllRecords);
router.get("/myAppointments/:patientName", patientController.getMyAppointments);
router.get("/getBills/:username", patientController.getBills);
router.post("/paybill/:billID", patientController.markBillAsPaid);
module.exports = router;
