
const ItineraryBooking = require("../../Models/itineraryBookingModel");
const Itinerary = require("../../Models/itineraryModel");


const commentItinerary = async (req, res) => {
    const { bookingId } = req.params;
    const { comment } = req.body;

    try {
        const booking = await ItineraryBooking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        booking.comment = comment;
        await booking.save();

        const itinerary = await Itinerary.findById(booking.itinerary._id);

        if (!itinerary) {
            return res.status(404).json({ message: "Itinerary not found" });
        }
        itinerary.comments.push(comment);
        await itinerary.save();

        res.status(200).json({ message: "Comment added successfully", itinerary });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    commentItinerary,
};