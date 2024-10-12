const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const complaintSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
        type: Boolean,  //true means it has been resolved else pending resolution
        required: false
    },
    response: {
        type:String,
        required:false
    },
    tourist: {
      type: String,
      required: false
    }
  },
  { timestamps: true }
);

const Complaint = mongoose.model("Complaint", complaintSchema);

module.exports = Complaint;

//title, body, date