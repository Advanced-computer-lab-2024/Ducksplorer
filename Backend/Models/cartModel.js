const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const cartSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // Reference to Product model
      quantity: { type: Number, default: 1, min: 1 },
    },
  ],
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
