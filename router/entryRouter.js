const express = require('express');
const router = express.Router();
const entryController = require("../controller/adminAuth");



router.post("/adminLogin", entryController.login);
router.post("/adminSignUp", entryController.signUp);


module.exports = router;
