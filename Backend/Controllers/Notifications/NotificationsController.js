const Notifications = require('../../Models/Notifications.js');

//get all unseen notifications for a certain user
const getNotifications = async (req, res) => {
    try{
        const user = req.body.user;
        if(!user){
            return res.status(400).json({err: "User not found"});
        }
        const notifications = await Notifications.find({user: user, seen: false});
        res.status(200).json(notifications);
    }catch(err){
        res.status(400).json({err: err.message});
    }
 }

 //mark a notification as seen
const markAsSeen = async (req, res) => {
    try{
        const notificationId = req.body.notificationId;
        if(!notificationId){
            return res.status(400).json({err: "Notification not found"});
        }
        const notification = await Notifications.findById(notificationId);
        if(!notification){
            return res.status(400).json({err: "Notification not found"});
        }
        notification.seen = true;
        await notification.save();
        res.status(200).json({message: "Notification marked as seen"});
    }catch(err){
        res.status(400).json({err: err.message});   
    }
}

module.exports = {getNotifications, markAsSeen};