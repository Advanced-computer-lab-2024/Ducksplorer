const express = require("express");
const router = express.Router();
const {
  createPayment,
  confirmOTP,
  sendConfirmation,
  getConfig,
  createPaymentIntent,
  notifyUpcomingActivities,
} = require("../Controllers/payment.js");

// Create a Stripe Payment Intent
router.post("/pay", createPayment);
router.post("/confirm-otp", confirmOTP);
router.post("/send-confirmation", sendConfirmation);
router.get("/config", getConfig);
router.post("/create-payment-intent", createPaymentIntent);
router.post("/notifyUpcomingActivities/:user", notifyUpcomingActivities);

module.exports = router;
