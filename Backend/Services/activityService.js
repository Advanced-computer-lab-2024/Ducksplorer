const Advertiser = require("../Models/advertiserModel.js");
const Activity = require("../Models/activityModel.js");
const { $gte } = require("sift");

  const createActivity = async (activityData) => {
        const { name, isOpen, advertiser, date, time, location, price, minPrice, maxPrice, category, tags, specialDiscount, duration } = activityData;
        
        const newActivity = new Activity({
            name,
            isOpen,
            advertiser,
            date,
            time,
            location,
            price,
            minPrice,
            maxPrice,
            category,
            tags,
            specialDiscount,
            duration
        });

        await newActivity.save();
        return newActivity;
  }

  const getAllActivitiesByAdvertiserId = async (advertiserId) => {
        const activities = await Activity.find({ advertiser: advertiserId });
        return activities;
};

  
const updateActivity = async (activityId, updatedData) => {
        const updatedActivity = await Activity.findByIdAndUpdate(activityId, updatedData, { new: true });
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
      query.name = {$regex: name, $options: "i"};
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
    const upcomingActivities = await Activity.find({date: {$gte : currentDate}})
    return upcomingActivities;
  }
  

module.exports = {createActivity, getAllActivitiesByAdvertiserId, updateActivity, deleteActivity, searchActivities, viewUpcomingActivities };