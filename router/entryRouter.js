const express = require('express');
const router = express.Router();
const entryController = require('../controller/entryController');



router.post('/admin_login',entryController.adminLogin);



module.exports = router;
