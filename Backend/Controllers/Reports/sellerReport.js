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

module.exports = { myProducts };
