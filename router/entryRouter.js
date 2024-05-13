const express = require('express');
const router = express.Router();
const entryController = require("../controller/adminAuth");
const checkController = require("../controller/checkController");


router.post("/adminLogin", entryController.login);
router.post("/adminSignUp", entryController.signUp);
router.get("/checkUsername", checkController.CheckMe);


module.exports = router;
