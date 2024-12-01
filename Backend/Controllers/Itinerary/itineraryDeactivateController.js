const express = require("express");
const itineraryModel = require("../../Models/itineraryModel");
const mongoose = require("mongoose");
const {
  createNotification,
} = require("../Notifications/NotificationsController");
const notificationRequestModel = require("../../Models/notificationRequestModel");

//This method changes the status of the  itinerary from active to inactive and vice versa
const toggleItineraryActiveStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const itinerary = await itineraryModel.findById(id);

    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }

    //check if it was deactivated before toggling state, if yes, send notification
    if (itinerary.isDeactivated == true) {
      const notificationRequest = await notificationRequestModel.find({
        eventId: id,
        notified: false,
      });
      
      for (const request of notificationRequest) {
        // Create and send the notification
        await createNotification(
            `The itinerary    is now accepting bookings!`, //"${itinerary.name}" put name here in space
            request.user,
            "Itinerary active!"
          );
          
        // Mark the request as notified to prevent duplicate notifications
        request.notified = true;
        await request.save();
      }
    }

    // Toggle the flag status
    itinerary.isDeactivated = !itinerary.isDeactivated; // Set flag to the opposite of its current value

    // Save the updated itinerary because it is not just changed in memory not on server
    const updatedItinerary = await itinerary.save();

    res.status(200).json({
      itinerary: updatedItinerary,
      message: `Itinerary flagged as ${
        updatedItinerary.isDeactivated ? "Deactivated" : "Activated"
      }`,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { toggleItineraryActiveStatus };
