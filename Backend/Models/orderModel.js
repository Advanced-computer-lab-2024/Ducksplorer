const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 

const orderSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1, // Ensure at least 1 quantity is ordered
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the Product model
        ref: 'Product', // Name of the Product model
        required: true,
    },
    date: {
        type: Date,
        default: Date.now, // Automatically set the current date
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0, // Ensure total price is never negative
    },
});

const Order = mongoose.model("Order", orderSchema);


module.exports = Order;
