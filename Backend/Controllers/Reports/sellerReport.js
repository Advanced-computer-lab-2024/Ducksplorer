const mongoose = require("mongoose");
const Seller = require("../../Models/sellerModel");
const Product = require("../../Models/productModel");
const PurchaseBooking = require("../../Models/purchaseBookingModel");

const viewMyProducts = async (req, res) => {
  const { sellerName } = req.params;

  try {
    const seller = await Seller.findOne({ userName: sellerName });
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }
    // Fetch all product for this seller
    const products = await Product.find({ seller: sellerName });

    if (!products || products.length === 0) {
      return res.status(404).json({ error: "No products found" });
    }
    // Mapping over the products to include the necessary fields (bookedCount, totalGain)
    const productsWithStats = products.map((product) => ({
      product,
      totalEarnings: product.totalGain,
    }));

    // Send the response with the products and their associated stats
    res.status(200).json(productsWithStats);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const filterMyProducts = async (req, res) => {
  const { sellerName } = req.params;
  const { date, month, year } = req.query;

  // Prepare the date filters
  const dateFilters = [];

  // Exact date filter
  if (date) {
    const dateObject = new Date(date); // Input date
    const startOfDay = new Date(
      Date.UTC(
        dateObject.getUTCFullYear(),
        dateObject.getUTCMonth(),
        dateObject.getUTCDate(),
        0,
        0,
        0
      )
    );
    const endOfDay = new Date(
      Date.UTC(
        dateObject.getUTCFullYear(),
        dateObject.getUTCMonth(),
        dateObject.getUTCDate(),
        23,
        59,
        59,
        999
      )
    );

    dateFilters.push({ chosenDate: { $gte: startOfDay, $lte: endOfDay } });
  }

  // Year and Month filter
  if (month || year) {
    const yearNum = year ? parseInt(year, 10) : new Date().getUTCFullYear(); // Default to current year if not provided
    const monthNum = month ? parseInt(month, 10) - 1 : 0; // Default to January if month is not provided

    const startOfMonth = new Date(Date.UTC(yearNum, monthNum, 1)); // Start of the month
    const endOfMonth = new Date(
      Date.UTC(yearNum, monthNum + 1, 0, 23, 59, 59, 999)
    ); // End of the month

    dateFilters.push({ chosenDate: { $gte: startOfMonth, $lte: endOfMonth } });
  }

  // Apply date filters
  const filters = {};
  if (dateFilters.length > 0) {
    filters.$and = dateFilters;
  }

  try {
    // Find all Products for the given seller
    const products = await Product.find({
      seller: sellerName,
      // ...filters, // Apply date filters
    });

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for the seller" });
    }

    // Array to store results
    const results = [];

    for (const product of products) {
      // Fetch all bookings for the current product
      const productBookings = await PurchaseBooking.find({
        product: product._id,
        ...filters, // Apply date filters to bookings
      });

      // Calculate number of bookings and total earnings
      const totalEarnings = productBookings.reduce(
        (sum, booking) => sum + booking.chosenPrice,
        0
      );

      // Add result to the array
      results.push({
        product,
        totalEarnings,
      });
    }

    // Send the response
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { viewMyProducts, filterMyProducts };
