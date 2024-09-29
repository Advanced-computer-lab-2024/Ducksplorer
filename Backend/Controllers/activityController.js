const Activity = require("../Models/activityModel.js");
const activityService = require("../Services/activityService.js");

const createActivity = async (req,res) => {
    try{
        const newActivity = await activityService.createActivity(req.body);
        res.status(201).json(newActivity);
  } catch (err) {
    res.status(500).json({ message: err.message});  }
};

const getAllActivitiesByAdvertiserId = async (req, res) => {
    try {
        const advertiserId = req.params.advertiserId;
        const activities = await activityService.getAllActivitiesByAdvertiserId(advertiserId);
        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateActivity = async (req, res) => {
    try {
        const activityId = req.params.activityId;
        const updatedData = req.body;
        const updatedActivity = await activityService.updateActivity(activityId, updatedData);
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
        res.status(500).json({ message: 'Error fetching activities' });
      }
};
const viewUpcomingActivities = async (req,res) => {
    try{
        const upcomingActivities = await activityService.viewUpcomingActivities();
        res.json(upcomingActivities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching upcoming activities' });
  }
};



 module.exports = {createActivity, getAllActivitiesByAdvertiserId, updateActivity, deleteActivity, searchActivities, viewUpcomingActivities};