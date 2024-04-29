const express = require('express');
const router = express.Router();
const doctorController = require("../controller/doctors/doctorAuth");



router.post("/doctorLogin", doctorController.doctorLogin);
router.post("/doctorSignUp", doctorController.doctorSignUp);


module.exports = router;

