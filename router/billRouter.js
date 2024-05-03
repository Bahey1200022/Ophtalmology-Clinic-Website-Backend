const express = require('express');
const router = express.Router();
const billController = require("../controller/Bills/billController");

router.post("/bills", billController.GenerateBill);

module.exports = router;
