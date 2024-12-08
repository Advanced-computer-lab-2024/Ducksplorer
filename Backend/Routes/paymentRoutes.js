const express = require("express");
const router = express.Router();
const {
  createPayment,
  confirmOTP,
  sendConfirmation,
  getConfig,
  createPaymentIntent,
  notifyUpcomingActivities,
  sendOtp,
} = require("../Controllers/payment.js");

// Create a Stripe Payment Intent
router.post("/pay", createPayment);//done but not tested
router.post("/confirm-otp", confirmOTP);//done but not tested
router.post("/send-confirmation", sendConfirmation);////done but not tested
router.get("/config", getConfig);//done but not tested
router.post("/sendOtp", sendOtp);//done but not tested
router.post("/create-payment-intent", createPaymentIntent);//done but not tested
router.post("/notifyUpcomingActivities/:user", notifyUpcomingActivities);//done but not tested

module.exports = router;
