const Activity = require("../Models/activityModel.js");
const activityService = require("../Services/activityServices.js");

const createActivity = async (req, res) => {
  try {
    const newActivity = await activityService.createActivity(req.body);
    res.status(201).json(newActivity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllActivitiesByAdvertiserId = async (req, res) => {
  try {
    const advertiserId = req.params.advertiserId;
    const activities = await activityService.getAllActivitiesByAdvertiserId(
      advertiserId
    );
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateActivity = async (req, res) => {
  try {
    const activityId = req.params.activityId;
    const updatedData = req.body;
    const updatedActivity = await activityService.updateActivity(
      activityId,
      updatedData
    );
    res.status(200).json(updatedActivity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteActivity = async (req, res) => {
  try {
    const activityId = req.params.activityId;
    const deletedActivity = await activityService.deleteActivity(activityId);
    if (!deletedActivity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    res.status(200).json({ message: "Activity deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const searchActivities = async (req, res) => {
  const searchParams = req.query;
  try {
    const activities = await activityService.searchActivities(searchParams);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: "Error fetching activities" });
  }
};
const viewUpcomingActivities = async (req, res) => {
  try {
    const upcomingActivities = await activityService.viewUpcomingActivities();
    res.json(upcomingActivities);
  } catch (error) {
    res.status(500).json({ message: "Error fetching upcoming activities" });
  }
};

// const filterActivities = async (req, res) => {
//   const { price, date, category, rating } = req.query;

//   try {
//     const activities = await activityService.filterActivities({
//       price,
//       date,
//       category,
//       rating,
//     });
//     res.json(activities); // Return activities as JSON
//   } catch (error) {
//     res.status(500).json({ message: "Error filtering activities" });
//   }
// };

const filterActivity = async (req, res) => {
  const { price, date, category, rating } = req.query; //missing prefs waiting for wael to create table
  const filters = {};

  if (price) filters.price = price;
  if (date) filters.date = language;
  if (category) filters.category = availableDatesAndTimes;
  if (rating) filters.rating = rating;

  try {
    const activities = await Activity.find(filters);
    res.status(200).json(activities);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const sortActivities = async (req, res) => {
  const { sortBy, order } = req.query;
  const currentDate = new Date();

  let sortCriteria = {};
  if (sortBy) {
    sortCriteria[sortBy] = order === "desc" ? -1 : 1;
  }

  try {
    const activities = await Activity.find({
      date: { $gte: currentDate },
    }).sort(sortCriteria);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: "Error sorting activities" });
  }
};

module.exports = {
  createActivity,
  getAllActivitiesByAdvertiserId,
  updateActivity,
  deleteActivity,
  searchActivities,
  viewUpcomingActivities,
  filterActivity,
  sortActivities,
};
