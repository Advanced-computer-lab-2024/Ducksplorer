const express = require('express');
const {getNotifications,markAsSeen,getAllNotifications,testNotification} = require("../../Controllers/Notifications/NotificationsController.js");
const router = express.Router();


router.get('/getNotifications/:user', getNotifications);
router.put('/markAsSeen/:id', markAsSeen);
router.get('/getAllNotifications', getAllNotifications);
router.post('/testNotification', testNotification);


module.exports = router;
