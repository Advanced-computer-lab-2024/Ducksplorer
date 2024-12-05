const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const activityBookingSchema = new Schema(
  {
    user: {
      type: String,
      ref: "Tourist",
      required: true,
    },
    activity: {
      type: Schema.Types.ObjectId,
      ref: "Activity",
      required: true,
    },
    chosenDate: {
      type: Date,
      required: true,
    },
    chosenPrice: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
      required: false,
    },
    comment: {
      type: String,
      default: "",
      required: false,
    },
    notificationSent: {
      type: Boolean,
      default: false,
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const ActivityBooking = mongoose.model(
  "ActivityBooking",
  activityBookingSchema
);

module.exports = ActivityBooking;
