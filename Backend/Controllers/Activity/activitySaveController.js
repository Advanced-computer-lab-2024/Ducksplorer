const activityModel = require("../../Models/activityModel");

const touristSaveActivity = async (req, res) => {
  const activityID = req.params.id;
  const { save, username } = req.body;

  console.log("body:", save, username, activityID);

  try {
    const activity = await activityModel.findById(activityID);

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    console.log("before ", activity);

    const existingSaveIndex = activity.saved.findIndex(
      (entry) => entry.user === username
    );

    if (existingSaveIndex !== -1) {
      // Update the existing save state
      activity.saved[existingSaveIndex].isSaved = save;
    } else {
      // Add a new save state
      activity.saved.push({ user: username, isSaved: save });
    }

    // Save changes to the database
    await activity.save();
    console.log("after ", activity);

    res.status(200).json({
      message: "activity saved successfully",
      saved: activity.saved,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getSaveStateActivity = async (req, res) => {
  const activityID = req.params.id;
  const user = req.params.username;
  try {
    const activity = await activityModel.findById(activityID);

    if (!activity) {
      return res.status(404).json({ message: "activity not found" });
    }

    const userSaveState = activity.saved.find((entry) => entry.user === user);

    if (userSaveState) {
      res.status(200).json({ saved: userSaveState.isSaved });
    } else {
      res.status(404).json({ message: "Save state not found for this user" });
    }

  } catch (error) {
    console.error("Error fetching rating:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { touristSaveActivity, getSaveStateActivity };
