const Advertiser = require("../Models/advertiserModel.js");
const Activity = require("../Models/activityModel.js");
const { $gte } = require("sift");

const createActivity = async (activityData) => {
  const {
    name,
    isOpen,
    advertiser,
    date,
    location,
    price,
    category,
    tags,
    specialDiscount,
    duration,
    flag,
  } = activityData;

  const newActivity = new Activity({
    name,
    isOpen,
    advertiser,
    date,
    location,
    price,
    category,
    tags,
    specialDiscount,
    duration,
    flag,
  });

  await newActivity.save();
  return newActivity;
};

const getAllActivitiesByAdvertiserId = async (advertiserId) => {
  const activities = await Activity.find({ advertiser: advertiserId });
  return activities;
};

const updateActivity = async (activityId, updatedData) => {
  const updatedActivity = await Activity.findByIdAndUpdate(
    activityId,
    updatedData,
    { new: true }
  );

  if (!updatedActivity) {
    throw new Error("Activity not found");
  }
  return updatedActivity;
};

const deleteActivity = async (activityId) => {
  const deletedActivity = await Activity.findByIdAndDelete(activityId);
  return deletedActivity;
};

const searchActivities = async (searchParams) => {
  const { name, category, tag } = searchParams;

  let query = {};

  if (name) {
    query.name = { $regex: name, $options: "i" };
  }
  if (category) {
    query.category = category;
  }
  if (tag) {
    query.tags = { $in: [tag] };
  }

  return await Activity.find(query);
};

const viewUpcomingActivities = async () => {
  const currentDate = new Date();
  const upcomingActivities = await Activity.find({
    date: { $gte: currentDate },
  });
  return upcomingActivities;
};

const filterActivities = async (filters) => {
  const { price, date, category, ratings } = filters;
  const filter = {};
  let query = { date: { $gte: new Date() } };

  if (price) {
    filter.price = { $regex: price };
  }
  if (date) {
    filter.date = date;
  }
  if (category) {
    filter.category = category;
  }
  if (ratings) {
    filter.ratings = { $in: [ratings] };
  }
  try {
    console.log(filters);
    return await Activity.find(filter); // Return the filtered activities
  } catch (error) {
    throw new Error("Error fetching activities");
  }
};

module.exports = {
  createActivity,
  getAllActivitiesByAdvertiserId,
  updateActivity,
  deleteActivity,
  searchActivities,
  viewUpcomingActivities,
  filterActivities,
};
