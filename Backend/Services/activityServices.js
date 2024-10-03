const Activity = require("../Models/activityModel");

const getAllActivities = async () => {
  const activities = await Activity.find();
  return activities;
};

const deleteActivity = async (ID) => {
  const activity = await Activity.findOneAndDelete(
    { ID: ID },
    { new: true },
    (err, deletedDocument) => {
      if (err) {
        console.error("Error deleting document", err);
      } else {
        console.log("Document successfully deleted !", deletedDocument);
      }
    }
  );

  return activity;
};

module.exports = { deleteActivity, getAllActivities };
