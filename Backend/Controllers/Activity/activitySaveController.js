const activityModel = require("../../Models/activityModel");

const touristSaveActivity = async (req, res) => {
    const activityID = req.params.id;
    const { save, username } = req.body;
    try {
      const activity = await activityModel.findById(activityID);
  
      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }

      activity.saved.isSaved = save;
      activity.saved.user = username;

      await activity.save();
      res.status(200).json({ activity, x: "Activity updated" });

    } catch (err) {
      res.status(400).json(err.message);
    }
  };

  module.exports = {touristSaveActivity};