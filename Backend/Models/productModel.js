const Seller = require("../Models/sellerModel");
const User = require("../Models/userModel");
const mongoose = require("mongoose");

// const reviewSchema = new mongoose.Schema({
//   user: {
//     type: String,
//     required: true,
//   },
//   comment: {
//     type: String,
//     required: true,
//   },
//   date: {
//     type: Date,
//   },
// });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  ratings: {
    type: [
      {
        buyer: { type: String, required: false },
        rating: { type: Number, required: false },
      },
    ],
    default: [],
  },
  availableQuantity: {
    type: Number,
    required: true,
  },
  picture: {
    type: String, // what is the type?
    // required: true
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  sales: {
    type: Number,
    required: false,
  },
  isArchived: {
    type: Boolean,
    required: false,
  },
  seller: {
    type: String,
    required: false,
  },
  reviews: {
    type: [
      {
        buyer: { type: String, required: false },
        review: { type: String, required: false },
      },
    ],
    default: [],
  }
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
