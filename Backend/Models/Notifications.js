const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    user: {
        type: String,
        ref: 'Tourist',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: false
    },
    seen: {
        type: Boolean,
        required: false
    },
    title: {
        type: String,
        required: false
    }
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;