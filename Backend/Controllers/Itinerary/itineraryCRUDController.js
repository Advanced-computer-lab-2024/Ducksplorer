const express = require("express");
const itineraryModel = require("../../Models/itineraryModel");
const mongoose = require("mongoose");
const tourGuideModel = require("../../Models/tourGuideModel");
const Itinerary = require("../../Models/itineraryModel");
const ItineraryBooking = require("../../Models/itineraryBookingModel");
const touristModel = require("../../Models/touristModel");
const TourGuide = require("../../Models/tourGuideModel");

const send = require("send");
const nodemailer = require("nodemailer");
const Tourist = require("../../Models/touristModel");
const {createNotification,} = require("../Notifications/NotificationsController.js");
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
      from: "Ducksplorer@gmail.com", // Sender address
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

const remindUpcomingItineraries = async (req, res) => {
  try {
    const today = new Date();
    const twoDaysLater = new Date();
    twoDaysLater.setDate(today.getDate() + 2);

    // Fetch bookings with chosenDate within 2 days and where reminderSent is false
    const bookingsToRemind = await ItineraryBooking.find({
      chosenDate: { $gte: today, $lte: twoDaysLater },
      reminderSent: false,
    });
    console.log("Bookings to remind:", bookingsToRemind);

    if (!bookingsToRemind || bookingsToRemind.length === 0) {
      return res
        .status(200)
        .json({ message: "No upcoming activity reminders to send." });
    }

    for (const booking of bookingsToRemind) {
      const tourist = booking.user; // Reference to the Tourist object
      console.log("Tourist:", tourist);
      const itinerary = booking.itinerary; // Reference to the Activity object
      console.log("Itinerary:", itinerary);

      // Ensure both tourist and activity data are available
      if (tourist && itinerary) {
        const touristData = await Tourist.findOne({ userName: tourist });
        const userEmail = touristData.email; // Extract email from the Tourist object
        console.log("User Email:", userEmail);
        const itineraryData = await Itinerary.findOne({ _id: itinerary });
        const itineraryName = itineraryData.name || "Itinerary Name"; // Extract name from the Activity object

        const emailMessage = `Reminder: Your itinerary "${itineraryName}" is happening on ${new Date(
          booking.chosenDate
        ).toLocaleDateString()}. Get ready!`;

        // Send the email notification
        await sendEmail(userEmail, "Upcoming Itinerary Reminder", emailMessage);

        // Mark the reminder as sent
        booking.reminderSent = true;
        await booking.save();
      }
    }

    res.status(200).json({
      message: "Reminders sent successfully.",
      bookingsReminded: bookingsToRemind.map((booking) => ({
        userEmail: booking.user.email,
        activityName: booking.itinerary.name,
        chosenDate: booking.chosenDate,
      })),
    });
  } catch (error) {
    console.error("Error sending reminders:", error);
    res
      .status(500)
      .json({ message: "Error sending reminders", error: error.message });
  }
};

const createItinerary = async (req, res) => {
  //create
  //add a new itinerary to the database with
  //activity,locations,timeline,language,price,availableDates,availableTimes,accessibility,pickUpLocation,dropOffLocation
  const {
    name,
    activity,
    locations,
    timeline,
    language,
    price,
    availableDatesAndTimes,
    accessibility,
    pickUpLocation,
    dropOffLocation,
    tourGuideUsername,
    rating,
    tags,
    flag,
  } = req.body;
  console.log(req.body);
  try {
    //first get id of tour guide from his username
    const tourGuide = await tourGuideModel.findOne({
      userName: tourGuideUsername,
    });

    if (!tourGuide) {
      return res.status(404).json({ error: "Tour guide not found" });
    }

    const itinerary = await itineraryModel.create({
      name,
      activity,
      locations,
      timeline,
      language,
      price,
      availableDatesAndTimes,
      accessibility,
      pickUpLocation,
      dropOffLocation,
      tourGuideModel: tourGuide._id,
      rating,
      tags,
      flag,
    });

    res.status(200).json(itinerary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllItineraries = async (req, res) => {
  //helper
  //retrieve all Itineraries from the database
  const { showPreferences, username, role } = req.query;
  if (showPreferences === "true" && role === "Tourist") {
    const tourist = await touristModel.findOne({ userName: username });
    const touristTags = tourist.tagPreferences;
    try {
      let itineraries = await itineraryModel.find();
      // Sort itineraries based on matching tags with the tourist's tags
      itineraries = itineraries.sort((a, b) => {
        const aHasMatch = a.tags.some((tag) => touristTags.includes(tag));
        const bHasMatch = b.tags.some((tag) => touristTags.includes(tag));

        if (aHasMatch && !bHasMatch) {
          return -1; // If 'a' has a match and 'b' doesn't, 'a' comes first
        } else if (!aHasMatch && bHasMatch) {
          return 1; // If 'b' has a match and 'a' doesn't, 'b' comes first
        } else {
          return 0; // If both have matches or both don't, retain their relative order
        }
      });
      res.status(200).json(itineraries);
    } catch (error) {
      res.status(400).json({ error: error.message, x: "oops" });
    }
  } else {
    try {
      const itinerary = await itineraryModel.find();
      res.status(200).json(itinerary);
    } catch (error) {
      res.status(400).json({ error: error.message, x: "oops" });
    }
  }
};

const getItinerary = async (req, res) => {
  //read
  //retrieve an Itinerary from the database
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID invalid" });
    }
    const itinerary = await itineraryModel.findById(id);
    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }
    res.status(200).json(itinerary);
  } catch (error) {
    res.status(400).json({ error: error.message, x: "oops" });
  }
};

const updateItinerary = async (req, res) => {
  //update
  //update an itinerary in the database
  console.log(req.body);
  try {
    const { id } = req.params;
    const {
      activity,
      locations,
      timeline,
      language,
      price,
      availableDatesAndTimes,
      accessibility,
      pickUpLocation,
      dropOffLocation,
      rating,
      tags,
    } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID invalid" });
    }
    const itinerary = await itineraryModel.findByIdAndUpdate(id, {
      activity,
      locations,
      timeline,
      language,
      price,
      availableDatesAndTimes,
      accessibility,
      pickUpLocation,
      dropOffLocation,
      rating,
      tags,
    });
    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }
    res.status(200).json({ itinerary, x: "Itinerary updated" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// const toggleFlagItinerary = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ error: "Invalid ID" });
//     }

//     const itinerary = await itineraryModel.findById(id);

//     if (!itinerary) {
//       return res.status(404).json({ error: "Itinerary not found" });
//     }

//     // Toggle the flag status
//     itinerary.flag = !itinerary.flag; // Set flag to the opposite of its current value

//     // Save the updated itinerary because it is not just changed in memory not on server
//     const updatedItinerary = await itinerary.save();

//     res.status(200).json({
//       itinerary: updatedItinerary,
//       message: `Itinerary flagged as ${
//         updatedItinerary.flag ? "inappropriate" : "appropriate"
//       }`,
//     });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

const toggleFlagItinerary = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const itinerary = await itineraryModel.findById(id);

    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }

    const itineraryTourGuide = itinerary.tourGuideModel;

    if (!itineraryTourGuide) {
      return res.status(404).json({ error: "Tour Guide not found" });
    }

    const tourGuide = await TourGuide.findById(itineraryTourGuide);

    if (!tourGuide) {
      return res.status(404).json({ error: "Tour guide details not found" });
    }

    if (itinerary.flag === undefined) {
      return res
        .status(400)
        .json({ messsage: "Doesn't have a flag attribute" });
    }

    // Toggle the flag status
    itinerary.flag = !itinerary.flag; // Set flag to the opposite of its current value

    // Save the updated itinerary because it is not just changed in memory not on server
    const updatedItinerary = await itinerary.save();

    // Send email to the advertiser if flagged as inappropriate
    if (updatedItinerary.flag) {
      const emailMessage = `Your itinerary has been flagged as inappropriate.`;

      await createNotification(
        `Your Itenary titled "${itinerary.name}" has been flagged as inappropriate.`,
        tourGuide.userName,
        "Iterary Flagged"
      ); 

      await sendEmail(
        tourGuide.email,
        `Your Itenary titled "${itinerary.name}" has been flagged as inappropriate.`,
        emailMessage
      );
    }

    res.status(200).json({
      status: 200,
      itinerary: updatedItinerary,
      advertiserMail: tourGuide.email,
      message: `Itinerary flagged as ${
        updatedItinerary.flag ? "inappropriate" : "appropriate"
      }`,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Helper function to send email notifications

const deleteOnlyNotBookedItinerary = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID invalid" });
    }
    const itinerary = await itineraryModel.findById(id);
    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }

    if (itinerary.bookedCount >= 1) {
      itinerary.deletedItinerary = true; // not actually deleting from DB since it is booked but making it invisible to future tourists
      console.log(itinerary.deletedItinerary);
      await itinerary.save();
      return res.status(200).json({ message: "Itinerary deleted" });
    }

    // If bookedCount is less than 1, proceed to delete from database normally
    await itineraryModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Itinerary deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deletePastItineraries = async (req, res) => {
  try {
    const currentDate = new Date();
    console.log("Current Date:", currentDate);

    // Find itineraries where all available dates are in the past
    const pastItineraries = await Itinerary.find({
      availableDatesAndTimes: { $not: { $gte: currentDate } },
    });
    console.log("Itineraries to delete:", pastItineraries);

    // Delete itineraries where all dates are in the past
    const resultIt = await Itinerary.deleteMany({
      availableDatesAndTimes: { $not: { $gte: currentDate } },
    });

    // Delete past itinerary bookings where chosenDate is in the past
    const resultBIt = await ItineraryBooking.deleteMany({
      chosenDate: { $lt: currentDate },
    });

    // Send combined response
    res.status(200).json({
      message: `Deleted ${resultIt.deletedCount} past itineraries and ${resultBIt.deletedCount} past itinerary bookings.`,
    });
  } catch (error) {
    console.error("Error deleting past itineraries:", error);
    res.status(500).json({ message: "Failed to delete past itineraries" });
  }
};

module.exports = {
  createItinerary,
  getItinerary,
  deleteOnlyNotBookedItinerary,
  updateItinerary,
  getAllItineraries,
  toggleFlagItinerary,
  deletePastItineraries,
  remindUpcomingItineraries,
};
