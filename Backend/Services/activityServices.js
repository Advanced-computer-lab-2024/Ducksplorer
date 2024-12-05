const Advertiser = require("../Models/advertiserModel.js");
const Activity = require("../Models/activityModel.js");
const { $gte } = require("sift");
const Category = require("../Models/activityCategory.js");
const Tags = require("../Models/preferenceTagsModels.js");
const getAllActivitiesByUsername = require("../Controllers/Activity/activityController.js");
const notificationRequestModel = require("../Models/notificationRequestModel.js");
const {
  createNotification,
} = require("../Controllers/Notifications/NotificationsController.js");
const ActivityBooking = require("../Models/activityBookingModel.js");

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

  try {
    // Validate the category: check if it exists in the Category collection
    const existingCategory = await Category.findOne({ name: category });
    if (!existingCategory) {
      throw new Error(`Category '${category}' does not exist.`);
    }

    // Validate the tags: check if each tag exists in the Tags collection
    const existingTags = await Tags.find({ name: { $in: tags } });
    const existingTagNames = existingTags.map((tag) => tag.name);

    // Check if all provided tags exist
    if (existingTagNames.length !== tags.length) {
      const missingTags = tags.filter((tag) => !existingTagNames.includes(tag));
      throw new Error(
        `The following tags do not exist: ${missingTags.join(", ")}`
      );
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

const updateActivity = async (activityId, updatedData) => {
  const currActivity = await Activity.findById(activityId);
  const updatedActivity = await Activity.findByIdAndUpdate(
    activityId,
    updatedData,
    { new: true }
  );

  if (currActivity.isOpen == false && updatedActivity.isOpen == true) {
    console.log("dakhalt?");
    const notificationRequest = await notificationRequestModel.find({
      eventId: activityId,
      notified: false,
    });

    for (const request of notificationRequest) {
      try {
        // Create and send the notification
        await createNotification(
          `The activity "${updatedActivity.name}" is now accepting bookings!`,
          request.user,
          "Activity open!"
        );

        // Mark the request as notified to prevent duplicate notifications
        request.notified = true;
        await request.save();
      } catch (err) {
        console.error(`Failed to notify user ${request.user}:`, err.message);
      }
    }
  }

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

const getActivitiesWithinDateRange = async (startDate, endDate) => {
  return await ActivityBooking.find({
    date: { $gte: startDate, $lte: endDate },
  });
};

const viewUpcomingActivities = async () => {
  const currentDate = new Date();
  const upcomingActivities = await Activity.find({
    date: { $gte: currentDate },
  });
  return upcomingActivities;
};

module.exports = {
  createActivity,
  getAllActivitiesByUsername,
  getActivitiesWithinDateRange,
  updateActivity,
  deleteActivity,
  searchActivities,
  viewUpcomingActivities,
};
