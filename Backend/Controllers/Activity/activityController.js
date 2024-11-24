const Activity = require("../../Models/activityModel.js");
const activityService = require("../../Services/activityServices.js");
const Tags = require("../../Models/preferenceTagsModels.js");
const Category = require("../../Models/activityCategory.js");
const mongoose = require("mongoose");
const ActivityBooking = require("../../Models/activityBookingModel.js");
const ItineraryBooking = require("../../Models/itineraryBookingModel.js");
const User = require("../../Models/userModel.js");
const Advertiser = require("../../Models/advertiserModel.js");
const send = require("send");
const nodemailer = require("nodemailer");
const {
  createNotification,
} = require("../Notifications/NotificationsController.js");
const Tourist = require("../../Models/touristModel.js");

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

const createActivity = async (req, res) => {
  try {
    const newActivity = await activityService.createActivity(req.body);
    res.status(201).json(newActivity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllActivitiesByUsername = async (req, res) => {
  try {
    const { advertiser } = req.params; // Change to username
    const activities = await Activity.find({ advertiser }); // Update the service method
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get activities that have flag false ie they are appropriate
const getAppropriateActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ flag: false });
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateActivity = async (req, res) => {
  try {
    const activityId = req.params.activityId;
    const updatedData = req.body;
    const updatedActivity = await activityService.updateActivity(
      activityId,
      updatedData
    );
    res.status(200).json(updatedActivity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteOnlyNotBookedActivity = async (req, res) => {
  try {
    const { activityId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(activityId)) {
      return res.status(400).json({ error: "ID invalid" });
    } else {
      const activity = await Activity.findById(activityId);
      if (!activity) {
        return res.status(404).json({ error: "Activity not found" });
      } else if (activity.bookedCount >= 1) {
        activity.deletedActivity = true; // not actually deleting from DB since it is booked but making it invisible to future tourists
        await activity.save();
        return res.status(200).json({ message: "Activity deleted" });
      } else {
        // If bookedCount is less than 1, proceed to delete from database normally
        await Activity.findByIdAndDelete(activityId);
        return res.status(200).json({ message: "Activity deleted" });
      }
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// const searchActivities = async (req, res) => {
//   const searchParams = req.query;
//   try {
//     const activities = await activityService.searchActivities(searchParams);
//     res.json(activities);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching activities" });
//   }
// };

// const searchActivities = async (req, res) => {
//     const { search } = req.query;
//     const filters = {};

//     if (search) {
//       filters.$or = [
//         { name: { $regex: search, $options: 'i' } }, // Search by name (case-insensitive)
//         { category: { $regex: search, $options: 'i' } }, // Search by category (case-insensitive)
//         { tags: { $regex: search, $options: 'i' } } // Search by tags (case-insensitive)
//       ];
//     }

//     try {
//       const activities = await Activity.find(filters);
//       res.status(200).json(activities);
//     } catch (error) {
//       res.status(400).json({ error: error.message });
//     }
//   };
const searchActivities = async (req, res) => {
  const { search, showPreferences, favCategory } = req.query;
  const filters = {};

  if (showPreferences === "false") {
    try {
      // If the user is searching, check both the activity name, category, and related tags in respective schemas
      if (search) {
        // Find matching tags in the preferenceTagsSchema
        const matchingTags = await Tags.find({
          name: { $regex: search, $options: "i" },
        });
        const matchingTagNames = matchingTags.map((tag) => tag.name); // Get array of matching tag names

        // Find matching categories in the Category schema
        const matchingCategories = await Category.find({
          name: { $regex: search, $options: "i" },
        });
        const matchingCategoryNames = matchingCategories.map(
          (category) => category.name
        ); // Get array of matching category names

        console.log("Matching Tags:", matchingTagNames);
        console.log("Matching Categories:", matchingCategoryNames);

        // Construct the filters to include name, matching categories, and matching preference tags
        filters.$or = [
          { name: { $regex: search, $options: "i" } }, // Search by name (case-insensitive)
        ];

        // Only add the category filter if there are matching categories
        if (matchingCategoryNames.length > 0) {
          filters.$or.push({ category: { $in: matchingCategoryNames } }); // Search by matching category names
        }

        // Only add the tag filter if there are matching tags
        if (matchingTagNames.length > 0) {
          filters.$or.push({ tags: { $in: matchingTagNames } }); // Search by matching preference tags
        }
      }
      // Fetch the activities based on the search filters
      const activities = await Activity.find(filters);
      res.status(200).json(activities);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    try {
      // If the user is searching, check both the activity name, category, and related tags in respective schemas
      if (search) {
        // Find matching tags in the preferenceTagsSchema
        const matchingTags = await Tags.find({
          name: { $regex: search, $options: "i" },
        });
        const matchingTagNames = matchingTags.map((tag) => tag.name); // Get array of matching tag names

        // Find matching categories in the Category schema
        const matchingCategories = await Category.find({
          name: { $regex: search, $options: "i" },
        });
        const matchingCategoryNames = matchingCategories.map(
          (category) => category.name
        ); // Get array of matching category names

        console.log("Matching Tags:", matchingTagNames);
        console.log("Matching Categories:", matchingCategoryNames);

        // Construct the filters to include name, matching categories, and matching preference tags
        filters.$or = [
          { name: { $regex: search, $options: "i" } }, // Search by name (case-insensitive)
        ];

        // Only add the category filter if there are matching categories
        if (matchingCategoryNames.length > 0) {
          filters.$or.push({ category: { $in: matchingCategoryNames } }); // Search by matching category names
        }

        // Only add the tag filter if there are matching tags
        if (matchingTagNames.length > 0) {
          filters.$or.push({ tags: { $in: matchingTagNames } }); // Search by matching preference tags
        }
      }

      // Fetch the activities based on the search filters
      let activities = await Activity.find(filters);
      activities = activities.sort((a, b) => {
        if (a.category === favCategory && b.category !== favCategory) {
          return -1; // "restaurant" category comes first
        } else if (b.category === favCategory && a.category !== favCategory) {
          return 1; // Move other categories after "restaurant"
        } else {
          return 0; // If both have the same category, retain their relative order
        }
      });
      res.status(200).json(activities);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

const viewUpcomingActivities = async (req, res) => {
  const { showPreferences, favCategory } = req.query;
  if (showPreferences) {
    try {
      const upcomingActivities = await activityService.viewUpcomingActivities();
      res.json(upcomingActivities);
    } catch (error) {
      res.status(500).json({ message: "Error fetching upcoming activities" });
    }
  } else {
    try {
      let upcomingActivities = await activityService.viewUpcomingActivities();
      upcomingActivities = upcomingActivities.sort((a, b) => {
        if (a.category === favCategory && b.category !== favCategory) {
          return -1; // "restaurant" category comes first
        } else if (b.category === favCategory && a.category !== favCategory) {
          return 1; // Move other categories after "restaurant"
        } else {
          return 0; // If both have the same category, retain their relative order
        }
      });
      res.status(200).json(upcomingActivities);
    } catch (error) {
      res.status(500).json({ message: "Error fetching upcoming activities" });
    }
  }
};

const remindUpcomingActivities = async (req, res) => {
  try {
    const today = new Date();
    const twoDaysLater = new Date();
    twoDaysLater.setDate(today.getDate() + 2);

    // Fetch bookings with chosenDate within 2 days and where reminderSent is false
    const bookingsToRemind = await ActivityBooking.find({
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
      const activity = booking.activity; // Reference to the Activity object
      console.log("Activity:", activity);

      // Ensure both tourist and activity data are available
      if (tourist && activity) {
        const touristData = await Tourist.findOne({ userName: tourist });
        const userEmail = touristData.email; // Extract email from the Tourist object
        console.log("User Email:", userEmail);
        const activityData = await Activity.findOne({ _id: activity });
        const activityName = activityData.name; // Extract name from the Activity object

        const emailMessage = `Reminder: Your activity "${activityName}" is happening on ${new Date(
          booking.chosenDate
        ).toLocaleDateString()}. Get ready!`;

        // Send the email notification
        await sendEmail(userEmail, "Upcoming Activity Reminder", emailMessage);

        // Mark the reminder as sent
        booking.reminderSent = true;
        await booking.save();
      }
    }

    res.status(200).json({
      message: "Reminders sent successfully.",
      bookingsReminded: bookingsToRemind.map((booking) => ({
        userEmail: booking.user.email,
        activityName: booking.activity.name,
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

const filterActivity = async (req, res) => {
  const { price, date, category, averageRating } = req.query;
  const filters = {};

  // Add filters based on query parameters
  if (price) filters.price = price;
  if (category) filters.category = category;

  // Handle the averageRating filter
  if (averageRating) {
    const numericRating = parseFloat(averageRating);
    if (!isNaN(numericRating) && numericRating >= 0 && numericRating < 5) {
      // Set the filters for average rating
      filters.averageRating = { $gte: numericRating, $lt: numericRating + 1 }; // 3 to 3.9, 4 to 4.9, etc.
    } else if (numericRating === 5) {
      // If the rating is 5, we just want to get those with an average rating of 5
      filters.averageRating = 5;
    } else {
      return res
        .status(400)
        .json({ error: "Rating must be a number between 0 and 5." });
    }
  }

  // Get the current date and set time to midnight
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Set to midnight

  // If a date is provided in the query
  if (date) {
    const providedDate = new Date(date);
    providedDate.setHours(0, 0, 0, 0); // Set provided date to midnight

    // Define the start and end of the provided date
    const startDate = providedDate;
    const endDate = new Date(providedDate);
    endDate.setHours(23, 59, 59, 999); // Set end of the day to just before midnight

    // Ensure the provided date is greater than or equal to the current date
    if (providedDate >= currentDate) {
      // Filter for activities on the exact provided date range
      filters.date = { $gte: startDate, $lte: endDate };
    } else {
      return res
        .status(400)
        .json({ error: "The provided date must be today or in the future." });
    }
  } else {
    // If no date is provided, filter for only upcoming activities
    filters.date = { $gte: currentDate };
  }

  try {
    const activities = await Activity.find(filters);
    res.status(200).json(activities);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const sortActivities = async (req, res) => {
  const { sortBy, order } = req.query;
  const currentDate = new Date();

  let sortCriteria = {};
  if (sortBy) {
    sortCriteria[sortBy] = order === "desc" ? -1 : 1;
  }

  try {
    const activities = await Activity.find({
      date: { $gte: currentDate },
    }).sort(sortCriteria);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: "Error sorting activities" });
  }
};

const rateActivity = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { rating } = req.body;

    // Find the activity booking and associated activity
    const activityBooking = await ActivityBooking.findById(bookingId);
    if (!activityBooking) return res.status(404).send("Booking not found");

    activityBooking.rating = rating;
    await activityBooking.save();

    const activity = await Activity.findById(activityBooking.activity);
    if (!activity) return res.status(404).send("Activity not found");

    // Update or add the rating specific to the booking
    const existingRating = activity.ratings.find(
      (r) => r.bookingId.toString() === bookingId
    );
    if (existingRating) {
      existingRating.rating = rating;
    } else {
      activity.ratings.push({ bookingId, rating });
    }

    // Recalculate the average rating
    const totalRating = activity.ratings.reduce((acc, r) => acc + r.rating, 0);
    activity.averageRating = totalRating / activity.ratings.length;

    await activity.save();

    res.status(200).json({
      updatedAverageRating: activity.averageRating,
      userRating: rating,
    });
  } catch (error) {
    console.error("Error updating rating:", error);
    res.status(500).send("Failed to update rating");
  }
};

const toggleFlagActivity = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const activity = await Activity.findById(id);
    const activityAdvertiser = activity.advertiser;

    if (!activityAdvertiser) {
      return res.status(404).json({ error: "Tour guide not found" });
    }

    const advertiser = await Advertiser.findOne({
      userName: activityAdvertiser,
    });

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }
    if (activity.flag === undefined) {
      return res.status(400).json({ messsage: "Doesnt have a flag attribute" });
    }
    // Toggle the flag status
    activity.flag = !activity.flag; // Set flag to the opposite of its current value

    // Save the updated activity because it is not just changed in memory not on server
    const updatedActivity = await activity.save();

    // Send email to the advertiser if flagged as inappropriate
    if (updatedActivity.flag) {
      const emailMessage = `Your activity titled "${activity.name}" has been flagged as inappropriate.`;

      // Create a notification for the advertiser on site
      await createNotification(
        `Your activity titled "${activity.name}" has been flagged as inappropriate.`,
        advertiser.userName,
        "Activity Flagged"
      );

      await sendEmail(
        advertiser.email,
        "Activity Flagged as Inappropriate",
        emailMessage
      );
    }

    res.status(200).json({
      status: 200,
      activity: updatedActivity,
      advetiserMail: advertiser.email,
      message: `Activity flagged as ${
        updatedActivity.flag ? "inappropriate" : "appropriate"
      }`,
    });
  } catch (error) {
    res.status(400).json({ error: error.message + "error in toggleFlag" });
  }
};

// const notiFlaginAppropriate = async (req, res) =>{
//   const {itemId, type, userName, } = req.body;
//   try{
//     userBookings = await ItineraryBooking.find(userName);

//   }
// };

const deletePastActivities = async (req, res) => {
  try {
    const currentDate = new Date();
    console.log("Current Date:", currentDate);

    const pastActivities = await Activity.find({ date: { $lt: currentDate } });
    console.log("Activities to delete:", pastActivities);

    const result = await Activity.deleteMany({
      date: { $lt: currentDate },
    });
    res.status(200).json({
      message: `Deleted ${result.deletedCount} past activities.`,
    });
  } catch (error) {
    console.error("Error deleting past activities:", error);
    res.status(500).json({ message: "Failed to delete past activities" });
  }
};

module.exports = {
  createActivity,
  getAllActivitiesByUsername,
  updateActivity,
  deleteOnlyNotBookedActivity,
  searchActivities,
  viewUpcomingActivities,
  filterActivity,
  sortActivities,
  rateActivity,
  getAppropriateActivities,
  toggleFlagActivity,
  remindUpcomingActivities,
  deletePastActivities,
};
