const Product = require("../Models/productModel");
const Order = require('../Models/orderModel'); // Adjust the path to your Order model

// Controller function to create a new order
const placeOrder = async (req, res) => {
    try {
        const { date, productId, quantity, username } = req.body;

        // Validate required fields
        if (!date || !productId || !quantity || !username) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Validate quantity
        if (quantity <= 0) {
            return res.status(400).json({ message: 'Quantity must be greater than zero.' });
        }

        // Find the product by ID
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        // Calculate total price
        const totalPrice = product.price * quantity;

        // Create a new order
        const newOrder = new Order({
            username,
            quantity,
            productId,
            date,
            totalPrice,
        });

        // Save the order to the database
        const savedOrder = await newOrder.save();

        // Send the response with the created order
        res.status(201).json({ message: 'Order placed successfully.', order: savedOrder });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = { placeOrder };
