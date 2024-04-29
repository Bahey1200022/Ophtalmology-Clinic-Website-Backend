const express = require('express');
const router = express.Router();
const entryController = require('../controller/entryController');



router.post('/adminLogin',entryController.adminLogin);
router.post('/doctorLogin',entryController.doctorsLogin);
router.post('/patientLogin',entryController.patientsLogin);


module.exports = router;
