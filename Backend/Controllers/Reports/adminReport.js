const mongoose = require("mongoose");
const ActivityBooking = require("../../Models/activityBookingModel");
const ItineraryBooking = require("../../Models/itineraryBookingModel");
const ProductBooking = require("../../Models/purchaseBookingModel");

const viewAllActivities = async (req, res) => {
  try {
    const activityBookings = await ActivityBooking.find().populate("activity");

    if (!activityBookings || activityBookings.length === 0) {
      return res.status(404).json({ error: "No activity bookings found" });
    }

    // Format the response to include activities with chosen price
    const activitiesWithPrices = activityBookings.map((booking) => ({
      activity: booking.activity,
      chosenPrice: booking.chosenPrice,
      chosenDate: booking.chosenDate,
    }));

    res.status(200).json(activitiesWithPrices);
  } catch (err) {
    console.error("Error fetching activities:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const viewAllItineraries = async (req, res) => {
  try {
    const itineraryBookings = await ItineraryBooking.find().populate("itinerary");

    if (!itineraryBookings || itineraryBookings.length === 0) {
      return res.status(404).json({ error: "No itinerary bookings found" });
    }

    const itinerariesWithPrices = itineraryBookings.map((booking) => ({
      itinerary: booking.itinerary,
      chosenPrice: booking.chosenPrice,
      chosenDate: booking.chosenDate,
    }));
    res.status(200).json(itinerariesWithPrices);
  } catch (err) {
    console.error("Error fetching itineraries:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const viewAllProducts = async (req, res) => {
  try {
    const productBookings = await ProductBooking.find().populate("product");

    if (!productBookings|| productBookings.length === 0) {
      return res.status(404).json({ error: "No product purchases found" });
    }
    const productsWithPrices = productBookings.map((booking) => ({
      product: booking.product,
      chosenPrice: booking.chosenPrice,
      chosenDate: booking.chosenDate,
      chosenQuantity:booking.chosenQuantity
    }));
    res.status(200).json(productsWithPrices);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { viewAllActivities, viewAllItineraries, viewAllProducts };
