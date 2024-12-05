const Tourist = require("../Models/touristModel.js");
const User = require("../Models/userModel.js");
const ItineraryBooking = require("../Models/itineraryBookingModel.js");
const ActivityBooking = require("../Models/activityBookingModel.js");
const { schedule } = require("node-cron");
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const send = require("send");
const Cron = require("../Models/cronModel.js");
const PromoCode = require("../Models/promoCodeModel.js");
const {
  createNotification,
} = require("./Notifications/NotificationsController.js");
let isCronEnabled = false; // Toggle to enable/disable cron job

let cronJob = null;

// Define the cron job but don't start it immediately
const setupCronJob = () => {
  cronJob = cron.schedule("44 20 * * *", async () => {
    if (isCronEnabled) {
      console.log("Cron job triggered...");
      await notifyUpcomingActivities();
    } else {
      console.log("Cron job is disabled.");
    }
  });
};

// Initialize the cron job setup
setupCronJob();

const toggleCron = (state) => {
  isCronEnabled = state;
  console.log(
    `Cron job state updated: ${isCronEnabled ? "Enabled" : "Disabled"}`
  );
};

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

const getTouristDetails = async (req, res) => {
  const { userName } = req.params;
  try {
    const tourist = await Tourist.findOne({ userName });

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    return res.status(200).json(tourist);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateTouristDetails = async (req, res) => {
  const userName = req.body.userName;
  const newPassword = req.body.password;
  const updateData = { ...req.body };
  console.log(updateData);

  try {
    // Update the Tourist details first
    const tourist = await Tourist.findOneAndUpdate({ userName }, updateData, {
      new: true,
    });

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    if (newPassword) {
      const user = await User.findOneAndUpdate(
        { userName },
        { password: newPassword } // Update with plain text password{ new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "User not found for update" });
      }
    }

    return res.status(200).json({ tourist }); // Return only Tourist for now
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//get all the preferences of a tourist
const getTouristPreferences = async (req, res) => {
  const { userName } = req.params;
  try {
    const tourist = await Tourist.findOne({ userName });

    if (!tourist) {
      res.status(404).json({ message: "Tourist not found" });
    } else {
      res.status(200).json(tourist.tagPreferences);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getFavoriteCategory = async (req, res) => {
  const { userName } = req.params;
  try {
    const tourist = await Tourist.findOne({ userName });

    if (!tourist) {
      res.status(404).json({ message: "Tourist not found" });
    } else {
      res.status(200).json(tourist.favouriteCategory);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteMyTouristAccount = async (req, res) => {
  try {
    // Get tourist username from the route parameters
    const { userName } = req.params;

    //Find the tourist by his username which is given as a parameter
    const tourist = await Tourist.findOne({ userName: userName });

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Delete the tourist account from the tourist model and users model
    await Tourist.findByIdAndDelete(tourist._id);
    await User.findOneAndDelete({ userName: userName });

    // Delete the tourist from the bookings table
    await ItineraryBooking.deleteMany({ user: userName });
    await ActivityBooking.deleteMany({ user: userName });

    // Respond with a success message
    res.status(200).json({ message: "Tourist account deleted successfully." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Scheduler to check birthdays daily
//cron.schedule("0 0 * * *", async () => {
const bod = async (res) => {
  const today = new Date();
  const todayMonth = today.getMonth() + 1; // Months are zero-based
  const todayDay = today.getDate(); // Get today's day

  try {
    // Find all tourists and filter by today's month and day
    const tourists = await Tourist.find().lean(); // Get all tourists as plain objects for easier manipulation
    const birthdayTourists = tourists.filter((tourist) => {
      const bodDate = new Date(tourist.DOB);
      const bodMonth = bodDate.getMonth() + 1;
      const bodDay = bodDate.getDate();
      return bodMonth === todayMonth && bodDay === todayDay;
    });

    if (!birthdayTourists || birthdayTourists.length === 0) {
      return { status: "success", message: "No birthdays today!", data: [] };
    }

    const responses = [];

    // Loop through each birthday tourist and send them an email
    for (const tourist of birthdayTourists) {
      const promoCode = `${Math.random()
        .toString(36)
        .substr(2, 9)
        .toUpperCase()}`; // Generate promo code

      const emailMessage = `🎉 Happy Birthday ya sa7by! 5od el promo dah le 2agl 3eyoonak dol: ${promoCode} 🎉`;

      // Save the promo code to the database
      const newPromoCode = new PromoCode({
        code: promoCode,
        value: 20, // Assign a value to the promo code
      });
      try {
        // Send the email
        console.log(tourist.email);
        //send notification on site
        await createNotification(
          emailMessage,
          tourist.userName,
          "Birthday Promo Code"
        );

        //send email
        await sendEmail(tourist.email, "Birthday Promo Code", emailMessage);
        await newPromoCode.save();

        // Optionally, save the promo code to the tourist's document in the database
        await Tourist.updateOne(
          { _id: tourist._id },
          { $set: { promoCode: promoCode } }
        );

        res.status(200).json({
          message: `Promo code sent to ${tourist.email}`,
        });
      } catch (emailError) {}
    }

    return {
      status: "success",
      message: "Birthday promo emails processed.",
      data: responses,
    };
  } catch (error) {
    return {
      status: "error",
      message: `An error occurred: ${error.message}`,
      data: [],
    };
  }
};
cron.schedule("00 00 * * *", async () => {
  try {
    //const cronState = await Cron.findOne({ name: "birthday" });
    console.log("Executing scheduled cron job: birthday");
    await bod();
  } catch (error) {
    console.error("Error executing scheduled cron job:", error);
  }
});

module.exports = {
  getTouristDetails,
  updateTouristDetails,
  getTouristPreferences,
  getFavoriteCategory,
  deleteMyTouristAccount,
  schedule,
  bod,
  toggleCron,
};
