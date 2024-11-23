const express = require('express');
const {getNotifications,markAsSeen} = require("../../Controllers/Notifications/NotificationsController.js");
const router = express.Router();


router.get('/getNotifications', getNotifications);
router.put('/markAsSeen', markAsSeen);

module.exports = router;
