const Seller = require('../Models/sellerModel');
const User = require('../Models/userModel');

const reviewSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId, // Assuming a reference to a User model
      ref: 'User',
      required: true
    },
    comment: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  });

const productSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true
    },
    ratings: {
      type: [Number], // Array of numbers representing ratings
      default: []
    },
    picture: {
      type: String, // what is the type?
      required: true
    },
    availableQuantity: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId, // Assuming a reference to a Seller model
      ref: "Seller",
      required: true
    },
    reviews: [reviewSchema] // Array of reviews
  });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
  