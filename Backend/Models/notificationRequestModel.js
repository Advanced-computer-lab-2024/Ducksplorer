const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationRequestSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    eventId: {
        type: String,
        required: true
    },
    notified: {
        type: Boolean,
        required: true,
        default: false 
    }
});

const NotificationRequest = mongoose.model('NotificationRequest', notificationRequestSchema);
module.exports = NotificationRequest;

