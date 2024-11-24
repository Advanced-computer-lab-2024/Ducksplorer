const Notifications = require('../../Models/Notifications.js');

//get all unseen notifications for a certain user
const getNotifications = async (req, res) => {
    try{
        const user = req.params.user;
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
        const id = req.params;
        if(!id){
            return res.status(400).json({err: "Notification not found"});
        }
        const notification = await Notifications.findById(id);
        if(!notification){
            return res.status(400).json({err: "Notification not found"});
        }
        notification.seen = true;
        await notification.save();
        res.status(200).json({message: "Notification marked as seen"});
    }catch(err){
        res.status(401).json({err: err.message});   
    }
}

//create a new notification
const createNotification = async (message, user) => {
    try{
        if(!message || !user){
            return;
        }
        const notification = new Notifications({
            message: message,
            user: user,
            seen: false,
            date: new Date()
        });
        await notification.save();
    }catch(err){
        console.log(err);
    }
}

//get all notifications for all users
const getAllNotifications = async (req, res) => {
    try{
        const notifications = await Notifications.find();
        res.status(200).json(notifications);
    }catch(err){
        res.status(400).json({err: err.message});
    }
}

//Add notification to a certain user for testing purposes
const testNotification = async (req, res) => {
    try{
        const message = req.body.message;
        const user = req.body.user;
        if(!message || !user){
            return res.status(400).json({err: "Message or user not found"});
        }
        await createNotification(message, user);
        res.status(200).json({message: "Notification added"});
    }catch(err){
        res.status(400).json({err: err.message});
    }
}

module.exports = {getNotifications, markAsSeen, createNotification, getAllNotifications ,testNotification};