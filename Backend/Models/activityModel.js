const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const activitySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    isOpen: {
      type: Boolean,
      required: true,
    },
    advertiser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Advertiser",
      required: false,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String, //link le google maps masalan
      required: true,
    },
    price: {
      type: Number,
      required: false,
    },
    category: {
      type: String,
      required: false,
    },
    tags: {
      type: [String], // depends on tags table
      required: true,
    },
    specialDiscount: {
      type: Number,
      required: false, //ask noha law msh required
    },
    duration: {
      //make it required fel frontend
      type: Number,
      required: false,
    },
    ratings: {
      type: [Number],
      required: false
    },
    averageRating: {
      type: Number,
      required: false
    }
  },
  { timestamps: true }
);

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;

//date, time, location (using Google Maps), price (or price range), category, tags, special discounts, if booking is open
