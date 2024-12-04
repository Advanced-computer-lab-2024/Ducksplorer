const Product = require("../Models/productModel");
const Order = require('../Models/orderModel'); // Adjust the path to your Order model

// Controller function to create a new order
const placeOrder = async (req, res) => {
    try {
        const { date, productId,  username } = req.body;
        let quantity = +req.body.quantity;
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


const removeProductFromOrder = async (username, productId) => {
  try {
      const result = await Order.deleteOne({ username, productId });

      if (result.deletedCount === 0) {
          return { success: false, message: 'Product not found in the order.' };
      }

      return { success: true, message: 'Product removed successfully.' };
  } catch (error) {
      console.error('Error removing product from order:', error);
      return { success: false, message: 'An error occurred while removing the product from the order.' };
  }
};


const getOrdersByUsername = async (req, res) => {
  const  username  = req.query; // Get the username from the request body
  
  try {
      const orders = await Order.find({ username });

      if (orders.length === 0) {
          return res.status(404).json({ success: false, message: 'No orders found for this username.' });
      }

      return res.status(200).json({ success: true, orders });
  } catch (error) {
      console.error('Error retrieving orders:', error);
      return res.status(500).json({ success: false, message: 'An error occurred while retrieving the orders.' });
  }
};

module.exports = { placeOrder , removeProductFromOrder, getOrdersByUsername };
