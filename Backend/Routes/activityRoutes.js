const express = require("express");
const activity = require("../Controllers/Activity/activityController.js");
const { toggleFlagActivity } = require('../Controllers/Activity/activityController');
const { commentActivity } = require('../Controllers/Activity/activityCommentController');

const router = express.Router();

router.route("/").post(activity.createActivity).get(activity.searchActivities);
router.route("/filter").get(activity.filterActivity);
router.route("/sort").get(activity.sortActivities);
router.route("/upcoming").get(activity.viewUpcomingActivities);
router
  .route("/:activityId")
  .patch(activity.updateActivity)
  .delete(activity.deleteOnlyNotBookedActivity);
router.get("/my/:advertiser", activity.getAllActivitiesByUsername);
router.get("/myAppropriate", activity.getAppropriateActivities);
router.post("/:activityId", activity.rateActivity);
router.route("/rate/:activityId").patch(activity.rateActivity);
router.route("/toggleFlagActivity/:id").put(toggleFlagActivity);
router.route("/commentActivity/:activityId").patch(commentActivity);

module.exports = router;
