const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const touristSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: Number,
      required: true,
    },
    nationality: {
      type: String,
      required: true,
      default: "Egyptian", //error (Lazem tet7at gowa quotations)
    },
    DOB: {
      type: Date,
      default: Date.now,
      get: (date) => date.toLocaleDateString("en-GB"),
      required: true,
    },
    hasReceivedBirthdayPromo: {
      type: Boolean,
      default: false,
    },
    employmentStatus: {
      required: true,
      type: String,
    },
    profilePicture: {
      filename: { type: String },
      filepath: { type: String },
      uploadedAt: { type: Date },
    },
    files: [
      {
        filename: String,
        filepath: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    wallet: {
      type: Number,
      required: true,
      default: 0,
      immutable: false, // This makes the field read-only
    },
    level: {
      type: Number,
      default: 1,
    },
    points: {
      type: Number,
      default: 0,
    },
    favouriteCategory: {
      required: false,
      type: String,
      default: "Category",
    },
    tagPreferences: {
      type: Array,
      required: false,
    },
    historicalPlacestags: {
      type: Array,
      required: false,
    },
    addresses: [
      {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
      },
    ],
  },
  { timestamps: true }
);

const Tourist = mongoose.model("Tourist", touristSchema);

module.exports = Tourist;
