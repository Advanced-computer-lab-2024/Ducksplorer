const Activity = require("../../Models/activityModel.js");


const commentActivity = async (req, res) => {
    const { activityId } = req.params;
    const { comment } = req.body;



    try {
        const activity = await Activity.findById(activityId);

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
