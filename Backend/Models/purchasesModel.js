const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const products = require("./productModel");

const purchasesSchema = new Schema(
  {
    buyer: {
      type: String,
      required: true,
    },
    products: {
      type: Array,
      schema: [products],
      required: true,
    },
  },
  { timestamps: true }
);

const Purchases = mongoose.model("Purchases", purchasesSchema);

module.exports = Purchases;
