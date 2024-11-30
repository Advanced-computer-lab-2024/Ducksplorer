const mongoose = require('mongoose');
const Activity = require('../../Models/activityModel');
const Itinerary = require("../../Models/itineraryModel");
const Product = require("../../Models/productModel");
const Advertiser = require('../../Models/advertiserModel');
const Tourguide = require('../../Models/tourGuideModel');
const Tourist = require('../../Models/touristModel');
const Seller = require('../../Models/sellerModel');
const User = require('../../Models/userModel');
const ActivityBooking = require("../../Models/activityBookingModel");
const ItineraryBooking = require("../../Models/itineraryBookingModel");
const ProductBooking = require("../../Models/purchaseBookingModel");

const viewAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find();

    if (activities.length === 0) {
      return res.status(404).json({ message: "No activities found" });
    }
    res.status(200).json(activities);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const viewAllItineraries = async (req, res) => {
  try {

    const itineraries = await Itinerary.find();
    if (itineraries.length === 0) {
      return res.status(404).json({ message: "No itineraries found" });
    }
    res.status(200).json(itineraries);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const viewAllProducts = async (req, res) => {
  try {

    const products = await Product.find();
    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }
    res.status(200).json(products);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsersWithEmails = async (req, res) => {
  try {
    const users = await User.find({ status: 'Approved' });
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    const results = [];

    for (const user of users) {
      let email = null;

      switch (user.role) {
        case "Tourist":
          const tourist = await Tourist.findOne({ userName: user.userName });
          email = (tourist) ? tourist.email : null;
          break;

        case "Guide":
          const tourGuide = await Tourguide.findOne({ userName: user.userName });
          email = (tourGuide) ? tourGuide.email : null;
          break;

        case "Seller":
          const seller = await Seller.findOne({ userName: user.userName });
          email = (seller) ? seller.email : null;
          break;

        case "Advertiser":
          const advertiser = await Advertiser.findOne({ userName: user.userName });
          email = (advertiser) ? advertiser.email : null;
          break;

        default:
          email = null;
          break;
      }

      // Add the user's details and email to the results array
      if (email !== null) {
        results.push({
          userName: user.userName,
          role: user.role,
          email: email,
          date: user.createdAt
        });
      }
    }

    // Return the results
    res.status(200).json(results);
  } catch (error) {
    console.error("Error retrieving email:", error);
    res.status(500).json({ message: error.message });
  }
};

const getAllUsersWithEmailsFilteredByMonth = async (req, res) => {
  const { month } = req.query;

  const dateFilters = [];

  // Apply month filter
  if (month) {
    const monthNum = parseInt(month, 10) - 1; // Convert to zero-based index
    const startOfMonth = new Date(new Date().getFullYear(), monthNum, 1); // Start of the month
    const endOfMonth = new Date(new Date().getFullYear(), monthNum + 1, 0, 23, 59, 59, 999); // End of the month

    dateFilters.push({ "createdAt": { $gte: startOfMonth, $lte: endOfMonth } });
  }

  // Apply date filters
  const filters = {};
  if (dateFilters.length > 0) {
    filters.$and = dateFilters;
  }

  try {
    // Retrieve users with the 'Approved' status and apply the date filter
    const users = await User.find({ status: 'Approved', ...filters });

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    const results = [];

    for (const user of users) {
      let email = null;

      switch (user.role) {
        case "Tourist":
          const tourist = await Tourist.findOne({ userName: user.userName });
          email = tourist ? tourist.email : null;
          break;

        case "Guide":
          const tourGuide = await Tourguide.findOne({ userName: user.userName });
          email = tourGuide ? tourGuide.email : null;
          break;

        case "Seller":
          const seller = await Seller.findOne({ userName: user.userName });
          email = seller ? seller.email : null;
          break;

        case "Advertiser":
          const advertiser = await Advertiser.findOne({ userName: user.userName });
          email = advertiser ? advertiser.email : null;
          break;

        default:
          email = null;
          break;
      }

      // Add the user's details and email to the results array if email is not null
      if (email !== null) {
        results.push({
          userName: user.userName,
          role: user.role,
          email: email,
          date: user.createdAt
        });
      }
    }

    if (!results || results.length === 0) {
      return res.status(200).json("");  // Returning an empty string
    }

    // Return the results
    res.status(200).json(results);
  } catch (error) {
    console.error("Error retrieving email:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { viewAllActivities, viewAllItineraries, viewAllProducts, getAllUsersWithEmails, getAllUsersWithEmailsFilteredByMonth };

//     // Format the response to include activities with chosen price
//     const activitiesWithPrices = activityBookings.map((booking) => ({
//       activity: booking.activity,
//       chosenPrice: booking.chosenPrice,
//       chosenDate: booking.chosenDate,
//     }));

//     res.status(200).json(activitiesWithPrices);
//   } catch (err) {
//     console.error("Error fetching activities:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// const viewAllItineraries = async (req, res) => {
//   try {
//     const itineraryBookings = await ItineraryBooking.find().populate("itinerary");

//     if (!itineraryBookings || itineraryBookings.length === 0) {
//       return res.status(404).json({ error: "No itinerary bookings found" });
//     }

//     const itinerariesWithPrices = itineraryBookings.map((booking) => ({
//       itinerary: booking.itinerary,
//       chosenPrice: booking.chosenPrice,
//       chosenDate: booking.chosenDate,
//     }));
//     res.status(200).json(itinerariesWithPrices);
//   } catch (err) {
//     console.error("Error fetching itineraries:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// const viewAllProducts = async (req, res) => {
//   try {
//     const productBookings = await ProductBooking.find().populate("product");

//     if (!productBookings|| productBookings.length === 0) {
//       return res.status(404).json({ error: "No product purchases found" });
//     }
//     const productsWithPrices = productBookings.map((booking) => ({
//       product: booking.product,
//       chosenPrice: booking.chosenPrice,
//       chosenDate: booking.chosenDate,
//       chosenQuantity:booking.chosenQuantity
//     }));
//     res.status(200).json(productsWithPrices);
//   } catch (err) {
//     console.error("Error fetching products:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

module.exports = { viewAllActivities, viewAllItineraries, viewAllProducts };
