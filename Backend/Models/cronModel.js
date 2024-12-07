const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cronSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  enabled: {
    type: Boolean,
    default: false,
  },
});

const Cron = mongoose.model("Cron", cronSchema);

module.exports = Cron;
