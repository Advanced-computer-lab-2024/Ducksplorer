const mongoose = require("mongoose");
const { schema } = require("./activityModel"); // This line is correct
const Activity = require("./activityModel");
const Schema = mongoose.Schema;
const TourGuide = require("./tourGuideModel");
const Tags = require("./preferenceTagsModels");
const ItineraryBooking = require("./itineraryBookingModel");

const itinerarySchema = new Schema(
  {
    name: {
      type: String,
    },
    activity: {
      type: Array,
      schema: [Activity],
      required: true,
    },
    locations: {
      type: Array,
      schema: [String],
      required: true,
    },
    timeline: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    availableDatesAndTimes: {
      type: [Date],
      required: true,
    },
    accessibility: {
      type: String,
      required: true,
    },
    pickUpLocation: {
      type: String,
      required: true,
    },
    dropOffLocation: {
      type: String,
      required: true,
    },
    tourGuideModel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TourGuide",
      required: false,
    },
    bookedCount: {
      type: Number,
      default: 0,
      required: false,
    },
    tags: {
      type: [String],
      required: false,
    },
    chosenDate: {
      type: Date,
      required: false,
    },
    flag: {
      //it is true this means the itinerary is inappropriate (since the default of a boolean is false the itinerary starts as appropriate)
      type: Boolean,
      default: false,
      required: false,
    },

    isDeactivated: {
      //created as deactivated because the default of any boolean is false and we want the itinerary to start as active when created (ie with this boolean as false)
      type: Boolean,
      default: false,
      required: false,
    },
    ratings: {
      type: [
        {
          bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ItineraryBooking",
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
    comments: {
      type: [String],
      required: false,
    },
    tourGuideDeleted: {
      //when the tour guide associated with this itinerary leaves it should no longer appear to tourists but should stay in the database if it is booked this is why we use this boolean
      type: Boolean,
      default: false,
      required: false,
    },

    //when the tour guide deletes an itinerary it should no longer appear to new tourists but should stay in the database if it is booked this is why we use this boolean
    deletedItinerary: {
      type: Boolean,
      default: false,
      required: false,
    },
    saved: [
      {
        user: { type: String, required: false, default: null }, // Username of the user who saved the activity
        isSaved: { type: Boolean, required: false, default: false }, // Whether the activity is saved
      },
    ],
    totalGain: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  { timestamps: true }
); // Moved `timestamps` to schema options here

const Itinerary = mongoose.model("Itinerary", itinerarySchema);

module.exports = Itinerary;
