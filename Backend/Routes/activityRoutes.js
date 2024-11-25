const express = require("express");
const activity = require("../Controllers/Activity/activityController.js");
const { toggleFlagActivity } = require('../Controllers/Activity/activityController');
const { commentActivity } = require('../Controllers/Activity/activityCommentController');
const { touristSaveActivity, getSaveStateActivity } = require('../Controllers/Activity/activitySaveController.js');

const router = express.Router();

router.route("/").post(activity.createActivity).get(activity.searchActivities);
router.route("/filter").get(activity.filterActivity);
router.route("/sort").get(activity.sortActivities);
router.route("/upcoming").get(activity.viewUpcomingActivities);
router.delete("/deletePast", activity.deletePastActivities);
router
  .route("/:activityId")
  .patch(activity.updateActivity)
  .delete(activity.deleteOnlyNotBookedActivity);
router.get("/my/:advertiser", activity.getAllActivitiesByUsername);
router.get("/myAppropriate", activity.getAppropriateActivities);
router.post("/:activityId", activity.rateActivity);
router.route("/rate/:bookingId").patch(activity.rateActivity);
router.route("/toggleFlagActivity/:id").put(toggleFlagActivity);
router.route("/commentActivity/:bookingId").patch(commentActivity);
router.route("/save/:id").put(touristSaveActivity);
router.route("/getSave/:id/:username").get(getSaveStateActivity);



module.exports = router;
