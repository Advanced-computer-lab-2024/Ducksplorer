const ActivityBooking = require("../../Models/activityBookingModel.js");
const Activity = require("../../Models/activityModel.js");


const commentActivity = async (req, res) => {
    const { bookingId } = req.params;
    const { comment } = req.body;

    try {
        const booking = await ActivityBooking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        booking.comment = comment;
        await booking.save();

        const activity = await Activity.findById(booking.activity._id);

        if (!activity) {
            return res.status(404).json({ message: "Activity not found" });
        }
        activity.comments.push(comment);
        await activity.save();

        res.status(200).json({ message: "Comment added successfully", activity });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    commentActivity,
};
