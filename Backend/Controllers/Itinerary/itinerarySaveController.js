const itineraryModel = require("../../Models/itineraryModel");

const touristSaveItinerary = async (req, res) => {
  const itineraryID = req.params.id;
  const { save, username } = req.body; // save = true or false

  console.log("body:", save, username, itineraryID);

  try {
    const itinerary = await itineraryModel.findById(itineraryID);

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    console.log("before ", itinerary);

    const existingSaveIndex = itinerary.saved.findIndex(
      (entry) => entry.user === username
    );

    if (existingSaveIndex !== -1) {
      // Update the existing save state
      itinerary.saved[existingSaveIndex].isSaved = save;
    } else {
      // Add a new save state
      itinerary.saved.push({ user: username, isSaved: save });
    }

    // Save changes to the database
    await itinerary.save();
    console.log("after ", itinerary);

    res.status(200).json({
      message: "Itinerary updated successfully",
      saved: itinerary.saved,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getSaveState = async (req, res) => {
  const itineraryID = req.params.id;
  const user = req.params.username;
  try {
    const itinerary = await itineraryModel.findById(itineraryID);

    if (!itinerary) {
      return res.status(404).json({ message: "itinerary not found" });
    }

    const userSaveState = itinerary.saved.find((entry) => entry.user === user);

    if (userSaveState) {
      res.status(200).json({ saved: userSaveState.isSaved });
    } else {
      res.status(404).json({ message: "Save state not found for this user" });
    }

  } catch (error) {
    console.error("Error fetching saved itinerary:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { touristSaveItinerary, getSaveState };
