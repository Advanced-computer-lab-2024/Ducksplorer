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

router.get("/getNotifications/:user", getNotifications);
router.put("/markAsSeen/:id", markAsSeen);
router.get("/getAllNotifications", getAllNotifications);
router.post("/testNotification", testNotification);

router.post("/request", requestNotification);

module.exports = router;
