const TourGuide = require('../Models/tourGuideModel.js');

const commentTourGuide = async (req, res) => {
    const { tourGuideId } = req.params;
    const { comment } = req.body;

   

    try {
        const tourGuide = await TourGuide.findById(tourGuideId);

        if (!tourGuide) {
            return res.status(404).json({ message: "Tour Guide not found" });
        }
        tourGuide.comments.push(comment);
        await tourGuide.save();

        res.status(200).json({ message: "Comment added successfully", tourGuide });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    commentTourGuide,
};
