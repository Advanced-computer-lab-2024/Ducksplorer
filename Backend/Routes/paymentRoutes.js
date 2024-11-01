const express = require("express");
const router = express.Router();
const { createPayment, confirmOTP, sendConfirmation } = require('../Controllers/payment.js');


// Create a Stripe Payment Intent
router.post('/pay', createPayment);
router.post('/confirm-otp', confirmOTP);
router.post('/send-confirmation', sendConfirmation);


module.exports = router;
