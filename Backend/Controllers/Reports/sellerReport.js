const mongoose = require('mongoose');
const Seller = require('../../Models/sellerModel');
const Product = require('../../Models/productModel');

const myProducts = async (req, res) => {
    const { sellerName } = req.params;

    try {
        const seller = await Seller.findOne({ userName: sellerName });

        if (!seller) {
            return res.status(404).json({ error: "Seller not found" });
        }

        const products = await Product.find({ seller: sellerName });
        if (products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }

        res.status(200).json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message });
    }
};

const filterMyProducts = async (req, res) => {
    const { sellerName } = req.params;
    const { date, month, year } = req.query;
    const filters = { seller: sellerName };
    const dateFilters = [];

    // Exact date filter
    if (date) {
        const dateObject = new Date(date); // Input date
        const startOfDay = new Date(Date.UTC(dateObject.getUTCFullYear(), dateObject.getUTCMonth(), dateObject.getUTCDate(), 0, 0, 0));
        const endOfDay = new Date(Date.UTC(dateObject.getUTCFullYear(), dateObject.getUTCMonth(), dateObject.getUTCDate(), 23, 59, 59, 999));

        // Add the date filter
        dateFilters.push({ date: { $gte: startOfDay, $lte: endOfDay } });
    }


    // Month and year filter
    else if (month && year) {
        const yearNum = parseInt(year, 10);
        const monthNum = parseInt(month, 10) - 1;
        const startOfMonth = new Date(yearNum, monthNum, 1);
        const endOfMonth = new Date(yearNum, monthNum + 1, 0, 23, 59, 59, 999);

        dateFilters.push({ date: { $gte: startOfMonth, $lte: endOfMonth } });
    }

    // Month-only filter
    else if (month) {
        const monthNum = parseInt(month, 10) - 1;
        const startOfMonth = new Date(new Date().getFullYear(), monthNum, 1);
        const endOfMonth = new Date(new Date().getFullYear(), monthNum + 1, 0, 23, 59, 59, 999); // End of the month

        dateFilters.push({ date: { $gte: startOfMonth, $lte: endOfMonth } });
    }

    // Year-only filter
    else if (year) {
        const yearNum = parseInt(year, 10);
        const startOfYear = new Date(yearNum, 0, 1);  // Start of the year
        const endOfYear = new Date(yearNum + 1, 0, 1); // Start of next year

        dateFilters.push({ date: { $gte: startOfYear, $lt: endOfYear } });
    }

    if (dateFilters.length > 0) {
        filters.$and = dateFilters;
    }

    try {
        const products = await Product.find(filters);
        // if (activities.length === 0) {
        //     return res.status(404).json({ message: "No activities found" });
        // }
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { myProducts, filterMyProducts };
