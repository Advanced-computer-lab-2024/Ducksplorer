const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Product = require("./productModel");

const purchaseBookingSchema = new Schema(
    {
        buyer: {
            type: String,
            required: true,
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        chosenDate: {
            type: Date,
            required: true
        },
        chosenPrice: {
            type: Number,
            required: true
        },
        chosenQuantity: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }
);

const PurchaseBooking = mongoose.model("PurchaseBooking", purchaseBookingSchema);

module.exports = PurchaseBooking;
