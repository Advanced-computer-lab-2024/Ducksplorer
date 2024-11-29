const mongoose = require('mongoose');
const Seller = require('../../Models/sellerModel');
const Product = require('../../Models/productModel');
const PurchaseBooking = require('../../Models/purchaseBookingModel');

const myProducts = async (req, res) => {
    const { sellerName } = req.params;

    try {
        // Fetch all activity bookings for the advertiser
        const productPurchase = await PurchaseBooking.find().populate('product');

        if (!productPurchase || productPurchase.length === 0) {
            return res.status(404).json({ error: "No purchase bookings found" });
        }

        // Filter bookings by the seller name and fetch products
        const filteredBookings = productPurchase.filter(
            (booking) => booking.product.seller === sellerName
        );

        if (!filteredBookings || filteredBookings.length === 0) {
            return res.status(404).json({ message: "No products found for the seller" });
        }

        // Format the response to include activities with chosen price
        const productsWithPrices = filteredBookings.map((booking) => ({
            product: booking.product,
            chosenDate: booking.chosenDate,
            chosenQuantity: booking.chosenQuantity,
            chosenPrice: booking.chosenPrice
        }));
        res.status(200).json(productsWithPrices);
    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

const filterMyProducts = async (req, res) => {
    const { sellerName } = req.params;
    const { date, month, year } = req.query;
    const dateFilters = [];

    // Exact date filter
    if (date) {
        const dateObject = new Date(date); // Input date
        const startOfDay = new Date(Date.UTC(dateObject.getUTCFullYear(), dateObject.getUTCMonth(), dateObject.getUTCDate(), 0, 0, 0));
        const endOfDay = new Date(Date.UTC(dateObject.getUTCFullYear(), dateObject.getUTCMonth(), dateObject.getUTCDate(), 23, 59, 59, 999));
        dateFilters.push({ chosenDate: { $gte: startOfDay, $lte: endOfDay } });
    }

    // Month and year filter
    else if (month && year) {
        const yearNum = parseInt(year, 10);
        const monthNum = parseInt(month, 10) - 1;
        const startOfMonth = new Date(yearNum, monthNum, 1);
        const endOfMonth = new Date(yearNum, monthNum + 1, 0, 23, 59, 59, 999);
        dateFilters.push({ chosenDate: { $gte: startOfMonth, $lte: endOfMonth } });
    }

    // Month-only filter
    else if (month) {
        const monthNum = parseInt(month, 10) - 1;
        const startOfMonth = new Date(new Date().getFullYear(), monthNum, 1);
        const endOfMonth = new Date(new Date().getFullYear(), monthNum + 1, 0, 23, 59, 59, 999);
        dateFilters.push({ chosenDate: { $gte: startOfMonth, $lte: endOfMonth } });
    }

    // Year-only filter
    else if (year) {
        const yearNum = parseInt(year, 10);
        const startOfYear = new Date(yearNum, 0, 1);
        const endOfYear = new Date(yearNum + 1, 0, 1);
        dateFilters.push({ chosenDate: { $gte: startOfYear, $lt: endOfYear } });
    }

    // Apply date filters
    const filters = {};
    if (dateFilters.length > 0) {
        filters.$and = dateFilters;
    }

    try {
        // Retrieve bookings and populate products
        const bookings = await PurchaseBooking.find(filters).populate({
            path: 'product',
            match: { seller: sellerName }, // Filter products by seller
        });

        // Log bookings for debugging
        console.log("All bookings before filtering:", bookings);

        // Filter out null products
        const results = bookings.filter(booking => booking.product !== null).map(booking => ({
            product: booking.product,
            chosenDate: booking.chosenDate,
            chosenQuantity: booking.chosenQuantity,
            chosenPrice: booking.chosenPrice
        }));

        // Log results for debugging
        console.log("Filtered results:", results);

        // If no results, send a 404 response
        if (results.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }

        // Log the chosenDate and chosenQuantity
        results.forEach(result => {
            console.log(`Product: ${result.product.name}, Date: ${result.chosenDate}, Quantity: ${result.chosenQuantity}`);
        });

        // Send results
        res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


module.exports = { myProducts, filterMyProducts };
