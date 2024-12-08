const express = require("express");
const {
  getNotifications,
  markAsSeen,
  getAllNotifications,
  testNotification,
} = require("../../Controllers/Notifications/NotificationsController.js");
const {
  requestNotification,
} = require("../../Controllers/Notifications/notificationRequestController.js");
const router = express.Router();

router.get("/getNotifications/:user", getNotifications); //done
router.put("/markAsSeen/:id", markAsSeen); //done
router.get("/getAllNotifications", getAllNotifications); //done
router.post("/testNotification", testNotification);//done

router.post("/request", requestNotification);//done

module.exports = router;
