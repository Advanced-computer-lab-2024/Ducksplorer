const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Tags = require("./preferenceTagsModels")

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
      type: String,
      ref: "Advertiser",
      required: false,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String, //link le google maps masalan
      required: true
    },
    price: {
      type: Number,
      required: false
    },
    category: {
      type: String,
      ref: "ActivityCategory",
      required: false,
    },
    tags: {
      type: Array,
      schema: [Tags],
      required: true
    },
    specialDiscount: {
      type: Number,
      required: false //ask noha law msh required
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
    },
    flag: {
      type: Boolean,
      required: false
    },
    comments: {
      type: [String],
      required: false,
    },
    bookedCount: {
      type: Number,
      default: 0,
      required: false
    }
  },



  { timestamps: true }
);

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;

