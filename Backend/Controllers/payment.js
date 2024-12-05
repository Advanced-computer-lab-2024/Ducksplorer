const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const cron = require("node-cron");

const nodemailer = require("nodemailer");
const Activity = require("../Models/activityModel");
const Itinerary = require("../Models/itineraryModel");
const Product = require("../Models/productModel");
const ActivityBooking = require("../Models/activityBookingModel");
const ItineraryBooking = require("../Models/itineraryBookingModel");
const send = require("send");
const Tourist = require("../Models/touristModel");

// Temporary store for OTPs
const OTPStore = {};

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // Or another email service provider
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async (to, subject, message) => {
  try {
    // Configure the email transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail", // You can replace it with another service like SendGrid, etc.
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: "ducksplorer@gmail.com", // Sender address
      to, // Receiver's email address
      subject, // Email subject
      text: message, // Email message
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send email: ${error.message}`);
  }
};

const notifyUpcomingActivities = async (req, res) => {
  try {
    // Extract the user parameter
    const { user } = req.params; // Assuming req.params.user contains the user string
    if (!user) {
      return res.status(400).json({ error: "User parameter is missing." });
    }
    console.log("user:", user);

    // Get the current date and time
    const now = new Date();
    console.log("Current Date:", now);

    // Get the date two days from now
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(now.getDate() + 2);
    console.log("Date two days from now:", twoDaysFromNow);

    // Query for bookings with activity dates within the next two days and not yet notified
    const bookings = await ActivityBooking.find({
      user: user, // Pass user directly as a string
      chosenDate: {
        $gte: now,
        $lte: twoDaysFromNow,
      },
      notificationSent: false,
    });
    console.log(bookings);

    // Send notifications
    for (const booking of bookings) {
      const { activities } = booking;
      //console.log(activities);
      // Fetch the user's email
      const userData = await Tourist.findOne({ userName: user });
      if (!userData) {
        console.error(`No user found with userName: ${user}`);
        continue;
      }
      //console.log(userData);

      const userEmail = userData.email; // Ensure userData.email exists
      for (const activity of activities) {
        // Send an email for each activity
        await sendEmail(
          userEmail,
          "Upcoming Event Reminder",
          `Reminder: You have an upcoming event "${activity.name}" on ${activity.date}.`
        );
      }

      // Mark notification as sent
      booking.notificationSent = true;
      await booking.save();
    }

    res.status(200).json({ message: "Notifications sent successfully." });
  } catch (error) {
    console.error("Error in notifying upcoming events:", error);
    res
      .status(500)
      .json({ error: "An error occurred while sending notifications." });
  }
};

// Schedule the job to run daily
cron.schedule("39 18 * * *", notifyUpcomingActivities); // Runs every day at 8:00 AM

const createPayment = async (req, res) => {
  //const itemId = req.params;
  const { amount, currency, email, type } = req.body;
  // let itemPrice = 0;
  // switch (type) {
  //     case 'Activity':
  //         itemPrice = await Activity.findOne({ _id: itemId }).select('price -_id');
  //         break;
  //     case 'Itinerary':
  //         itemPrice = await Itinerary.findOne({ _id: itemId }).select('price -_id');
  //         break;
  //     case 'Product':
  //         itemPrice = await Product.findOne({ _id: itemId }).select('price -_id');
  //         break;
  //     case 'Hotel':
  //         itemPrice = hotel.price;
  //         break;
  //     case 'Flight':
  //         itemPrice = flight.price;
  //         break;
  //     default:
  //         return res.status(400).json({ message: 'Invalid booking type' });
  // }
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to smallest currency unit
      currency: "EUR",
      receipt_email: email,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createPaymentIntent = async (req, res) => {
  const { email } = req.body;

  try {
    // Generate OTP
    const OTP = Math.floor(100000 + Math.random() * 900000);
    OTPStore[email] = OTP;

    // Send OTP via email
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Your OTP for Payment Verification",
      text: `Your OTP is: ${OTP}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ error: "Error sending OTP email" });
      }
      res.status(200).json({
        sent: true,
        message: "Payment intent created, OTP sent via email",
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const sendOtp = async (req, res) => {
  const { email } = req.body;
  const OTP = Math.floor(100000 + Math.random() * 900000);
  OTPStore[email] = OTP;
  await sendEmail(email, "OTP for Payment Verification", `Your OTP is: ${OTP}`);
  res.status(200).json({ message: "OTP sent successfully" });
};

const getConfig = (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
};

const confirmOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (OTPStore[email] && OTPStore[email] === parseInt(otp)) {
    delete OTPStore[email]; // OTP verified, remove from store
    res.status(200).json({ message: "OTP verified" });
    //sendConfirmation(
  } else {
    res.status(400).json({ message: "Invalid OTP" });
  }
};

const sendConfirmation = async (req, res) => {
  const { email, itemId, type } = req.body;

  let booking;
  switch (type) {
    case "activity":
      booking = await Activity.findOne({ _id: itemId }).select(
        "name date location price category tags duartion averageRating -_id"
      );
      break;
    case "itinerary":
      booking = await Itinerary.findOne({ _id: itemId }).select(
        "name activity date location price category tags duartion averageRating -_id"
      );
      break;
    default:
      return res.status(400).json({ message: "Invalid booking type" });
  }

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  const bookingDetails = `
    <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; color: #333;">
        <thead style="background-color: #f4f4f4; text-align: left;">
            <tr>
                <th style="border: 1px solid #ddd; padding: 12px;">Key</th>
                <th style="border: 1px solid #ddd; padding: 12px;">Value</th>
            </tr>
        </thead>
        <tbody>
            ${Object.entries(booking.toObject())
              .map(
                ([key, value]) => `
                <tr>
                    <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold; background-color: #fafafa;">${key}</td>
                    <td style="border: 1px solid #ddd; padding: 10px; background-color: #fff;">${value}</td>
                </tr>
            `
              )
              .join("")}
        </tbody>
    </table>
  `;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: "Booking Confirmation",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h1 style="text-align: center; color: #4CAF50;">Your Booking is Confirmed!</h1>
          <p style="font-size: 16px; text-align: center; color: #666;">
              Thank you for booking with us. Below are your booking details:
          </p>
          <div style="margin: 20px auto; max-width: 600px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 8px; overflow: hidden;">
              ${bookingDetails}
          </div>
          <p style="text-align: center; margin-top: 20px; font-size: 14px; color: #999;">
              If you have any questions, feel free to contact us at support@example.com.
          </p>
      </div>
    `,
  };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res
        .status(500)
        .json({ error: "Error sending confirmation email" });
    }
    res.status(200).json({ message: "Confirmation email sent" });
  });
};

module.exports = {
  createPayment,
  confirmOTP,
  sendConfirmation,
  getConfig,
  createPaymentIntent,
  notifyUpcomingActivities,
  sendOtp,
};
