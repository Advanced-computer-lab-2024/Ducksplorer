const express = require("express");
const Cronn = require("../Models/cronModel.js");
const {
  getTouristDetails,
  updateTouristDetails,
  deleteMyTouristAccount,
  getTouristPreferences,
  getFavoriteCategory,
  bod,
} = require("../Controllers/touristAccount.js");
const { createCron } = require("../Controllers/cronController.js");

const router = express.Router();
const { toggleCron } = require("../Controllers/touristAccount.js");

router.post("/toggle-cron", async (req, res) => {
  try {
    // Find or create the cron state in the database
    let cronState = await Cronn.findOne({ name: "notifyUpcoming" });
    console.log("cronState", cronState);

    // Toggle the state
    cronState.enabled = !cronState.enabled;
    await cronState.save();

    res.status(200).json({
      message: `Cron job ${
        cronState.enabled ? "enabled" : "disabled"
      } successfully.`,
      enabled: cronState.enabled,
    });
  } catch (error) {
    console.error("Error toggling cron state:", error);
    res.status(500).json({ message: "Error toggling cron state.", error });
  }
});
router.post("/createCron", createCron);//done but idk what is this

router.get("/viewaccount/:userName", getTouristDetails);//done

router.put("/editaccount", updateTouristDetails);//done but not tested

router.delete("/deleteMyTouristAccount/:userName", deleteMyTouristAccount);//done but not tested

router.get("/preferences/:userName", getTouristPreferences);//done

router.get("/favoriteCategory/:userName", getFavoriteCategory);//done

router.post("/bod", bod);//done but idk what is this

module.exports = router;
