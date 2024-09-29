const express = require("express");
const activity = require("../Controllers/activityController.js");

const router = express.Router();

router.post("/", activity.createActivity);
router.route("/:activityId").patch(activity.updateActivity).delete(activity.deleteActivity);
router.get("/:advertiserId", activity.getAllActivitiesByAdvertiserId);
module.exports = router;