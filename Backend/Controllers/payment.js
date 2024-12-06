const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const cron = require("node-cron");
const Cron = require("../Models/cronModel"); // Cron model
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

const sendEmail = async (to, subject, htmlContent) => {
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
      html: htmlContent,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send email: ${error.message}`);
  }
};

// State to enable/disable the cron job
let isCronEnabled = false;

// Function to toggle cron state
const toggleCron = (state) => {
  isCronEnabled = state;
  console.log(
    `Cron job state updated: ${isCronEnabled ? "Enabled" : "Disabled"}`
  );
};

// Notify function
const notifyUpcomingActivities = async () => {
  try {
    console.log("Running notifyUpcomingActivities cron job...");

    // Get the current date and time
    const now = new Date();
    console.log("Current Date:", now);

    // Get the date two days from now
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(now.getDate() + 2);
    console.log("Date two days from now:", twoDaysFromNow);

    // Query all bookings with activity dates within the next two days and not yet notified
    const bookings = await ActivityBooking.find({
      chosenDate: {
        $gte: now,
        $lte: twoDaysFromNow,
      },
      //notificationSent: false,
    });

    console.log(`Found ${bookings.length} bookings for notification.`);

    // Process notifications
    for (const booking of bookings) {
      const { user, activity } = booking;
      const activityData = await Activity.findOne({ _id: activity });
      console.log("activity:", activity);
      console.log(booking.name);
      // Fetch the user's email
      const userData = await Tourist.findOne({ userName: user });
      if (!userData) {
        console.error(`No user found with userName: ${user}`);
        continue;
      }

      const userEmail = userData.email;

      // Send an email for the activity
      await sendEmail(
        userEmail,
        "Reminder: Your Upcoming Event",
        `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #0056b3;">Upcoming Event Reminder</h2>
            <p>Dear ${userData.firstName || user},</p>
            <p>
              We are excited to remind you about your upcoming event:
            </p>
            <table style="border-collapse: collapse; width: 100%; max-width: 600px; margin-top: 20px;">
              <tr>
                <td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Event Name</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${
                  activityData.name
                }</td>
              </tr>
              <tr>
                <td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Date</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${booking.chosenDate.toDateString()}</td>
              </tr>
              <tr>
                <td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Price</td>
                <td style="padding: 8px; border: 1px solid #ddd;">$${booking.chosenPrice.toFixed(
                  2
                )}</td>
              </tr>
            </table>
            <p style="margin-top: 20px;">
              We look forward to seeing you at the event. If you have any questions, feel free to reach out to us.
            </p>
            <p style="margin-top: 20px;">
              Best regards,<br/>
              <strong>Your Events Team</strong>
            </p>
          </body>
        </html>
        `
      );

      console.log(
        `Notification sent to ${userEmail} for activity: ${activity.name}`
      );

      // Mark notification as sent
      booking.notificationSent = true;
      await booking.save();
      console.log(`Notification status updated for booking ID: ${booking._id}`);
    }

    console.log("All notifications sent successfully.");
  } catch (error) {
    console.error("Error in notifying upcoming events:", error);
  }
};

const notifyUpcomingItineraries = async () => {
  try {
    console.log("Running notifyUpcomingItineraries cron job...");

    // Get the current date and time
    const now = new Date();
    console.log("Current Date:", now);

    // Get the date two days from now
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(now.getDate() + 2);
    console.log("Date two days from now:", twoDaysFromNow);

    // Query all bookings with activity dates within the next two days and not yet notified
    const bookings = await ItineraryBooking.find({
      chosenDate: {
        $gte: now,
        $lte: twoDaysFromNow,
      },
      //notificationSent: false,
    });

    console.log(`Found ${bookings.length} bookings for notification.`);

    // Process notifications
    for (const booking of bookings) {
      const { user, itinerary } = booking;
      const activityData = await Itinerary.findOne({ _id: itinerary });
      console.log("itinerary:", itinerary);
      console.log(booking.name);
      // Fetch the user's email
      const userData = await Tourist.findOne({ userName: user });
      if (!userData) {
        console.error(`No user found with userName: ${user}`);
        continue;
      }

      const userEmail = userData.email;

      // Send an email for the activity
      await sendEmail(
        userEmail,
        "Reminder: Your Upcoming Event",
        `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #0056b3;">Upcoming Event Reminder</h2>
            <p>Dear ${userData.firstName || user},</p>
            <p>
              We are excited to remind you about your upcoming event:
            </p>
            <table style="border-collapse: collapse; width: 100%; max-width: 600px; margin-top: 20px;">
              <tr>
                <td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Event Name</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${
                  activityData.name
                }</td>
              </tr>
              <tr>
                <td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Date</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${booking.chosenDate.toDateString()}</td>
              </tr>
              <tr>
                <td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Price</td>
                <td style="padding: 8px; border: 1px solid #ddd;">$${booking.chosenPrice.toFixed(
                  2
                )}</td>
              </tr>
            </table>
            <p style="margin-top: 20px;">
              We look forward to seeing you at the event. If you have any questions, feel free to reach out to us.
            </p>
            <p style="margin-top: 20px;">
              Best regards,<br/>
              <strong>Your Events Team</strong>
            </p>
          </body>
        </html>
        `
      );

      console.log(
        `Notification sent to ${userEmail} for activity: ${itinerary.name}`
      );

      // Mark notification as sent
      booking.notificationSent = true;
      await booking.save();
      console.log(`Notification status updated for booking ID: ${booking._id}`);
    }

    console.log("All notifications sent successfully.");
  } catch (error) {
    console.error("Error in notifying upcoming events:", error);
  }
};

cron.schedule("44 23 * * *", async () => {
  try {
    const cronState = await Cron.findOne({ name: "notifyUpcoming" });
    if (cronState?.enabled) {
      console.log("Executing scheduled cron job: notifyUpcomingActivities");
      await notifyUpcomingActivities();
      await notifyUpcomingItineraries();
    } else {
      console.log("Cron job 'notifyUpcomingActivities' is disabled. Skipping.");
    }
  } catch (error) {
    console.error("Error executing scheduled cron job:", error);
  }
});

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
