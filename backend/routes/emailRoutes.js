const express = require('express');
const { sendEmail } = require('../controller/emailController');
const router = express.Router();

router.post('/send-email', sendEmail);

module.exports = router;
