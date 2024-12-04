const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Tags = require("./preferenceTagsModels");

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
      required: true,
    },
    price: {
      type: Number,
      required: false,
    },
    category: {
      type: String,
      ref: "ActivityCategory",
      required: false,
    },
    tags: {
      type: Array,
      schema: [Tags],
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
      type: [
        {
          bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ActivityBooking",
            required: true,
          },
          rating: {
            type: Number,
            required: true,
            min: 0,
            max: 5,
          },
        },
      ],
      default: [],
    },
    averageRating: {
      type: Number,
      required: false,
    },
    flag: {
      //it is true this means the activity is inappropriate (since the default of a boolean is false the activity starts as appropriate)
      type: Boolean,
      default: false,
      required: false,
    },
    comments: {
      type: [String],
      required: false,
    },
    bookedCount: {
      type: Number,
      default: 0,
      required: false,
    },
    //when the advertiser associated with this activity leaves it should no longer appear to new tourists but should stay in the database if it is booked this is why we use this boolean
    advertiserDeleted: {
      type: Boolean,
      default: false,
      required: false,
    },
    //when the advertiser deletes an activity it should no longer appear to new tourists but should stay in the database if it is booked this is why we use this boolean
    deletedActivity: {
      type: Boolean,
      default: false,
      required: false,
    },
    saved: {
      user: { type: String, required: false, default: null },
      isSaved: { type: Boolean, required: false, default: false },
    },
    totalGain: {
      type: Number,
      required: false,
      default: 0,
    },
  },

  { timestamps: true }
);

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;
