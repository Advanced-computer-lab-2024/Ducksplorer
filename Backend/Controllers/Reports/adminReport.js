const mongoose = require("mongoose");
const Activity = require("../../Models/activityModel");
const Itinerary = require("../../Models/itineraryModel");
const Product = require("../../Models/productModel");
const Advertiser = require("../../Models/advertiserModel");
const Tourguide = require("../../Models/tourGuideModel");
const Tourist = require("../../Models/touristModel");
const Seller = require("../../Models/sellerModel");
const User = require("../../Models/userModel");
const ActivityBooking = require("../../Models/activityBookingModel");
const ItineraryBooking = require("../../Models/itineraryBookingModel");
const PurchaseBooking = require("../../Models/purchaseBookingModel");

const viewAllActivities = async (req, res) => {
  try {
    // Fetch all itineraries
    const activities = await Activity.find();
    if (activities.length === 0) {
      return res.status(404).json({ message: "No activities found" });
    }

    // Mapping over the activities to include the necessary fields (bookedCount, totalGain)
    const activitiesWithStats = activities.map((activity) => ({
      activity,
      numOfBookings: activity.bookedCount,
      totalEarnings: activity.totalGain,
    }));

    // Send the response with the activities and their associated stats
    res.status(200).json(activitiesWithStats);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

const calculateTotalBookingsAndEarnings = async (req, res) => {
  try {
    // Aggregate the total bookings and earnings
    const totals = await ActivityBooking.aggregate([
      {
        $group: {
          _id: null, // Group all documents together
          totalBookings: { $sum: 1 }, // Count the number of bookings
          totalEarnings: { $sum: "$chosenPrice" }, // Sum the earnings from `amountPaid`
        },
      },
    ]);

    if (totals.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }

    // Extract the totals from the aggregation result
    const { totalBookings, totalEarnings } = totals[0];

    // Send the aggregated totals
    res.status(200).json({ totalBookings, totalEarnings });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
};


const viewAllItineraries = async (req, res) => {
  try {
    // Fetch all itineraries
    const itineraries = await Itinerary.find();
    if (!itineraries || itineraries.length === 0) {
      return res.status(404).json({ error: "No itineraries found" });
    }

    // Mapping over the itineraries to include the necessary fields (bookedCount, totalGain)
    const itinerariesWithStats = itineraries.map((itinerary) => ({
      itinerary,
      numOfBookings: itinerary.bookedCount,
      totalEarnings: itinerary.totalGain,
    }));

    // Send the response with the itinerariesWithStats and their associated stats
    res.status(200).json(itinerariesWithStats);
  } catch (err) {
    console.error("Error fetching itineraries:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const calculateTotalItineraryBookingsAndEarnings = async (req, res) => {
  try {
    // Aggregate the total bookings and earnings for itineraries
    const totals = await ItineraryBooking.aggregate([
      {
        $group: {
          _id: null, // Group all documents together
          totalBookings: { $sum: 1 }, // Count the number of bookings
          totalEarnings: { $sum: "$chosenPrice" }, // Sum the earnings from `chosenPrice`
        },
      },
    ]);

    if (totals.length === 0) {
      return res.status(404).json({ message: "No itinerary bookings found" });
    }

    // Extract the totals from the aggregation result
    const { totalBookings, totalEarnings } = totals[0];

    // Send the aggregated totals
    res.status(200).json({ totalBookings, totalEarnings });
  } catch (err) {
    console.error("Error calculating itinerary totals:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const viewAllProducts = async (req, res) => {

  try {
    // Fetch all products for this seller
    const products = await Product.find();

    if (!products || products.length === 0) {
      return res.status(404).json({ error: "No products found" });
    }

    // Mapping over the products to include the necessary fields (bookedCount, totalEarnings)
    const productsWithStats = await Promise.all(
      products.map(async (product) => {
        // Fetch all bookings for this product
        const bookings = await PurchaseBooking.find({ product: product._id });

        // Calculate total earnings (sum of chosen price for each booking)
        const totalEarnings = bookings.reduce((acc, booking) => acc + booking.chosenPrice, 0);

        // Count how many times this product has been booked
        const bookedCount = bookings.length;

        return {
          product,
          bookedCount, // Add the booked count
          totalEarnings, // Calculate total earnings
        };
      })
    );

    // Send the response with the products and their associated stats
    res.status(200).json(productsWithStats);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const calculateTotalProductBookingsAndEarnings = async (req, res) => {

  try {
    // Fetch all products
    const products = await Product.find();

    if (!products || products.length === 0) {
      return res.status(404).json({ error: "No products found" });
    }

    // Initialize total counters
    let totalBookings = 0;
    let totalEarnings = 0;

    // Mapping over the products to calculate total bookings and total earnings
    await Promise.all(
      products.map(async (product) => {
        // Fetch all bookings for this product
        const bookings = await PurchaseBooking.find({ product: product._id });

        // Calculate total earnings for this product (sum of chosen price for each booking)
        const totalProductEarnings = bookings.reduce((acc, booking) => acc + booking.chosenPrice, 0);

        // Count how many times this product has been booked
        const bookedCount = bookings.length;

        // Add the current product's stats to the overall totals
        totalBookings += bookedCount;
        totalEarnings += totalProductEarnings;
      })
    );

    // Send the response with only the total bookings and total earnings
    res.status(200).json({
      totalBookings, // Total booked count across all products
      totalEarnings, // Total earnings across all products
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const filterAllActivities = async (req, res) => {
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
    // Find all Activities
    const activities = await Activity.find();

    if (!activities || activities.length === 0) {
      return res.status(404).json({ message: "No activities found" });
    }

    // Array to store results
    const results = [];

    for (const activity of activities) {
      // Fetch all bookings for the current activity
      const activityBookings = await ActivityBooking.find({
        activity: activity._id,
        ...filters, // Apply date filters to bookings
      });

      // Calculate number of bookings and total earnings
      const numOfBookings = activityBookings.length;
      const totalEarnings = activityBookings.reduce(
        (sum, booking) => sum + booking.chosenPrice,
        0
      );

      // Add result to the array
      results.push({
        activity,
        numOfBookings,
        totalEarnings,
      });
    }

    // Send the response
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const calculateTotalBookingsAndEarningsWithFilters = async (req, res) => {
  const { date, month, year } = req.query;

  try {
    // Prepare the date filters
    const dateFilters = [];

    if (date) {
      const dateObject = new Date(date);
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

    if (month || year) {
      const yearNum = year ? parseInt(year, 10) : new Date().getUTCFullYear();

      if (month) {
        const monthNum = parseInt(month, 10) - 1; // Adjust for zero-based months
        const startOfMonth = new Date(Date.UTC(yearNum, monthNum, 1));
        const endOfMonth = new Date(
          Date.UTC(yearNum, monthNum + 1, 0, 23, 59, 59, 999)
        );
        dateFilters.push({ chosenDate: { $gte: startOfMonth, $lte: endOfMonth } });
      } else {
        // If only year is specified, filter the entire year
        const startOfYear = new Date(Date.UTC(yearNum, 0, 1));
        const endOfYear = new Date(
          Date.UTC(yearNum + 1, 0, 0, 23, 59, 59, 999)
        );
        dateFilters.push({ chosenDate: { $gte: startOfYear, $lte: endOfYear } });
      }
    }

    // Combine filters into a single query
    const filters = dateFilters.length > 0 ? { $and: dateFilters } : {};

    // Aggregate the total bookings and earnings with filters applied
    const totals = await ActivityBooking.aggregate([
      { $match: filters }, // Apply date filters
      {
        $group: {
          _id: null, // Group all documents
          totalBookings: { $sum: 1 }, // Count bookings
          totalEarnings: { $sum: "$chosenPrice" }, // Sum earnings
        },
      },
    ]);

    if (totals.length === 0) {
      return res.status(404).json({ message: "No bookings found for the specified filters" });
    }

    const { totalBookings, totalEarnings } = totals[0];

    // Send the aggregated totals
    res.status(200).json({ totalBookings, totalEarnings });
  } catch (err) {
    console.error("Error calculating totals:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const filterAllItineraries = async (req, res) => {
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
    // Find all Itineraries
    const itineraries = await Itinerary.find();

    if (!itineraries || itineraries.length === 0) {
      return res.status(404).json({ message: "No itineraries found" });
    }

    // Array to store results
    const results = [];

    for (const itinerary of itineraries) {
      // Fetch all bookings for the current itinerary
      const itineraryBookings = await ItineraryBooking.find({
        itinerary: itinerary._id,
        ...filters, // Apply date filters to bookings
      });

      // Calculate number of bookings and total earnings
      const numOfBookings = itineraryBookings.length;
      const totalEarnings = itineraryBookings.reduce(
        (sum, booking) => sum + booking.chosenPrice,
        0
      );

      // Add result to the array
      results.push({
        itinerary,
        numOfBookings,
        totalEarnings,
      });
    }

    // Send the response
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching itineraries:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const calculateTotalItineraryBookingsAndEarningsWithFilters = async (req, res) => {
  const { date, month, year } = req.query;

  try {
    // Prepare the date filters
    const dateFilters = [];

    if (date) {
      const dateObject = new Date(date);
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

    if (month || year) {
      const yearNum = year ? parseInt(year, 10) : new Date().getUTCFullYear();

      if (month) {
        const monthNum = parseInt(month, 10) - 1; // Adjust for zero-based months
        const startOfMonth = new Date(Date.UTC(yearNum, monthNum, 1));
        const endOfMonth = new Date(
          Date.UTC(yearNum, monthNum + 1, 0, 23, 59, 59, 999)
        );
        dateFilters.push({ chosenDate: { $gte: startOfMonth, $lte: endOfMonth } });
      } else {
        // If only year is specified, filter the entire year
        const startOfYear = new Date(Date.UTC(yearNum, 0, 1));
        const endOfYear = new Date(
          Date.UTC(yearNum + 1, 0, 0, 23, 59, 59, 999)
        );
        dateFilters.push({ chosenDate: { $gte: startOfYear, $lte: endOfYear } });
      }
    }

    // Combine filters into a single query
    const filters = dateFilters.length > 0 ? { $and: dateFilters } : {};

    // Aggregate total bookings and earnings for filtered itineraries
    const totals = await ItineraryBooking.aggregate([
      { $match: filters }, // Apply date filters
      {
        $group: {
          _id: null, // Group all documents together
          totalBookings: { $sum: 1 }, // Count total bookings
          totalEarnings: { $sum: "$chosenPrice" }, // Sum total earnings
        },
      },
    ]);

    if (totals.length === 0) {
      return res.status(404).json({ message: "No bookings found for the specified filters" });
    }

    const { totalBookings, totalEarnings } = totals[0];

    // Return the totals
    res.status(200).json({ totalBookings, totalEarnings });
  } catch (err) {
    console.error("Error calculating filtered totals:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const filterAllProducts = async (req, res) => {
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
      // ...filters, // Apply date filters to products if needed
    });

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for the seller" });
    }

    // Mapping over the products to include the necessary fields (bookedCount, totalEarnings)
    const productsWithStats = await Promise.all(
      products.map(async (product) => {
        // Fetch all bookings for the current product with date filters applied
        const productBookings = await PurchaseBooking.find({
          product: product._id,
          ...filters, // Apply date filters to bookings
        });

        // Calculate the number of bookings and total earnings
        const bookedCount = productBookings.length;
        const totalEarnings = productBookings.reduce(
          (sum, booking) => sum + booking.chosenPrice,
          0
        );

        // Return the product with the stats
        return {
          product,
          bookedCount,
          totalEarnings,
        };
      })
    );

    // Send the response with products and their associated stats
    res.status(200).json(productsWithStats);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const calculateTotalProductBookingsAndEarningsWithFilters = async (req, res) => {
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
    // Fetch all bookings for all products with the date filters applied
    const bookings = await PurchaseBooking.find({
      ...filters, // Apply date filters to bookings
    });

    // Calculate the total number of bookings and total earnings
    const totalBookings = bookings.length;
    const totalEarnings = bookings.reduce((sum, booking) => sum + booking.chosenPrice, 0);

    // Return the aggregated totals
    res.status(200).json({
      totalBookings,
      totalEarnings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const getAllUsersWithEmails = async (req, res) => {
  try {
    const users = await User.find({ status: "Approved" });
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
          const tourGuide = await Tourguide.findOne({
            userName: user.userName,
          });
          email = tourGuide ? tourGuide.email : null;
          break;

        case "Seller":
          const seller = await Seller.findOne({ userName: user.userName });
          email = seller ? seller.email : null;
          break;

        case "Advertiser":
          const advertiser = await Advertiser.findOne({
            userName: user.userName,
          });
          email = advertiser ? advertiser.email : null;
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
          date: user.createdAt,
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
    const endOfMonth = new Date(
      new Date().getFullYear(),
      monthNum + 1,
      0,
      23,
      59,
      59,
      999
    ); // End of the month

    dateFilters.push({ createdAt: { $gte: startOfMonth, $lte: endOfMonth } });
  }

  // Apply date filters
  const filters = {};
  if (dateFilters.length > 0) {
    filters.$and = dateFilters;
  }

  try {
    // Retrieve users with the 'Approved' status and apply the date filter
    const users = await User.find({ status: "Approved", ...filters });

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
          const tourGuide = await Tourguide.findOne({
            userName: user.userName,
          });
          email = tourGuide ? tourGuide.email : null;
          break;

        case "Seller":
          const seller = await Seller.findOne({ userName: user.userName });
          email = seller ? seller.email : null;
          break;

        case "Advertiser":
          const advertiser = await Advertiser.findOne({
            userName: user.userName,
          });
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
          date: user.createdAt,
        });
      }
    }

    if (!results || results.length === 0) {
      return res.status(200).json([]);
    }

    // Return the results
    res.status(200).json(results);
  } catch (error) {
    console.error("Error retrieving email:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  viewAllActivities,
  viewAllItineraries,
  viewAllProducts,
  filterAllActivities,
  filterAllItineraries,
  filterAllProducts,
  getAllUsersWithEmails,
  getAllUsersWithEmailsFilteredByMonth,
  calculateTotalBookingsAndEarnings,
  calculateTotalBookingsAndEarningsWithFilters,
  calculateTotalItineraryBookingsAndEarnings,
  calculateTotalItineraryBookingsAndEarningsWithFilters,
  calculateTotalProductBookingsAndEarnings,
  calculateTotalProductBookingsAndEarningsWithFilters
};
