const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const promoCodeSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
    },
    value: {
      //discount percentage i.e. 10 is 10%
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    }, // Promo code availability
    expiryDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const PromoCode = mongoose.model("PromoCode", promoCodeSchema);

module.exports = PromoCode;
