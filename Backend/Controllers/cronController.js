const Cronn = require("../Models/cronModel");

const createCron = async (req, res) => {
  //create
  //add a new itinerary to the database with
  //activity,locations,timeline,language,price,availableDates,availableTimes,accessibility,pickUpLocation,dropOffLocation
  const { name, enabled } = req.body;
  console.log(req.body);
  try {
    const cron = await Cronn.create({
      name,
      enabled,
    });

    res.status(200).json(cron);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
module.exports = { createCron };
