const express = require("express");
const activity = require("../Controllers/Activity/activityController.js");
const {
  toggleFlagActivity,
} = require("../Controllers/Activity/activityController");
const {
  commentActivity,
} = require("../Controllers/Activity/activityCommentController");
const {
  touristSaveActivity,
  getSaveStateActivity,
} = require("../Controllers/Activity/activitySaveController.js");

const router = express.Router();

router.route("/").post(activity.createActivity).get(activity.searchActivities); //done
router.route("/filter").get(activity.filterActivity); //done
router.route("/sort").get(activity.sortActivities);//done
router.route("/upcoming").get(activity.viewUpcomingActivities);//done
router.delete("/deletePast", activity.deletePastActivities); //done
router
  .route("/:activityId")
  .patch(activity.updateActivity)//done
  .delete(activity.deleteOnlyNotBookedActivity);//done

router.get("/my/:advertiser", activity.getAllActivitiesByUsername);//done
router.post("/reminder", activity.remindUpcomingActivities); //done but not tested
router.get("/getAppropriate", activity.getAppropriateActivities); // done

router.post("/:activityId", activity.rateActivity); //not used anymore
router.route("/rate/:bookingId").patch(activity.rateActivity); //done

router.route("/toggleFlagActivity/:id").put(toggleFlagActivity); //done

router.route("/commentActivity/:bookingId").patch(commentActivity);//done

router.route("/save/:id").put(touristSaveActivity);//done
router.route("/getSave/:id/:username").get(getSaveStateActivity); //done msh sha8ala ka FE

module.exports = router;
