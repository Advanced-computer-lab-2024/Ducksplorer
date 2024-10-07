const express = require("express");
const activity = require("../Controllers/activityController.js");

const router = express.Router();

router.route("/").post(activity.createActivity).get(activity.searchActivities);
router.route("/filter").get(activity.filterActivity);
router.route("/sort").get(activity.sortActivities);
router.route("/upcoming").get(activity.viewUpcomingActivities);
router
  .route("/:activityId")
  .patch(activity.updateActivity)
  .delete(activity.deleteActivity);
router.get("/my/:advertiser", activity.getAllActivitiesByUsername);
router.post("/:activityId", activity.rateActivity);
router.route("/rate/:activityId").patch(activity.rateActivity);
module.exports = router;