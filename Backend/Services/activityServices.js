const Advertiser = require("../Models/advertiserModel.js");
const Activity = require("../Models/activityModel.js");
const { $gte } = require("sift");
const Category = require("../Models/activityCategory.js");
const Tags = require("../Models/preferenceTagsModels.js")

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
  } = activityData;

  try {
    // Validate the category: check if it exists in the Category collection
    const existingCategory = await Category.findOne({ name: category });
    if (!existingCategory) {
      throw new Error(`Category '${category}' does not exist.`);
    }

    // Validate the tags: check if each tag exists in the Tags collection
    const existingTags = await Tags.find({ name: { $in: tags } });
    const existingTagNames = existingTags.map(tag => tag.name);

    // Check if all provided tags exist
    if (existingTagNames.length !== tags.length) {
      const missingTags = tags.filter(tag => !existingTagNames.includes(tag));
      throw new Error(`The following tags do not exist: ${missingTags.join(', ')}`);
    }

    // If validation passes, create the new activity
    const newActivity = new Activity({
      name,
      isOpen,
      advertiser,
      date,
      location,
      price,
      category: existingCategory.name, // Ensure we use the validated category
      tags: existingTagNames, // Ensure we use the validated tags
      specialDiscount,
      duration,
    });

    await newActivity.save();
    return newActivity;

  } catch (error) {
    // Handle validation or saving errors
    throw new Error(error.message);
  }
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
  console.log(updatedData);
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
    query.category = { $regex: category, $options: "i" };
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
