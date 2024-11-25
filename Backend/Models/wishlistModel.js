const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const products = require("./productModel");

const wishlistSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    products: {
      type: Array,
      schema: [products],
      required: false,
    },
  },
  { timestamps: true }
);

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

module.exports = Wishlist;
