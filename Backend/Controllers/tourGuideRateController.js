const TourGuide = require('../Models/tourGuideModel.js');

const rateTourGuide = async (req, res) => {
    const { tourGuideId } = req.params;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({
            message: "Invalid rating. Please provide a rating between 1 and 5.",
        });
    }

    try {
        const tourGuide = await TourGuide.findById(tourGuideId);

        if (!tourGuide) {
            return res.status(404).json({ message: "Tour Guide not found" });
        }
        tourGuide.ratings.push(rating);
        const sum = tourGuide.ratings.reduce((acc, val) => acc + val, 0);
        tourGuide.averageRating = sum / tourGuide.ratings.length;
        await tourGuide.save();

        res.status(200).json({ message: "Rating added successfully", tourGuide });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    rateTourGuide,
};
