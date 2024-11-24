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

    itinerary.saved = {
      user: username, // Assign the username
      isSaved: save, // Assign the toggled save state
    };

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

    if (itinerary.saved && (itinerary.saved.user === user || itinerary.saved.user === null)) {
      return res.status(200).json({ saved: itinerary.saved.isSaved });
    } else {
      return res
        .status(404)
        .json({ message: "Save state not found for this user" });
    }
  } catch (error) {
    console.error("Error fetching saved itinerary:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { touristSaveItinerary, getSaveState };
