const TourGuide = require('../Models/tourGuideModel.js');


 const getTourGuideDetails = async (req, res) => {
    const {userName} = req.params;
    try {
      const tourGuide = await TourGuide.findOne({userName});
  
      if (!tourGuide){
        return res.status(404).json({ message: 'Tour Guide not found' });
      }

      return res.status(200).json(tourGuide);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

   const updateTourGuideDetails = async (req, res) => {
    const userName = req.body.userName;
    const updateData = req.body;
  
    try {
      const tourGuide = await TourGuide.findOneAndUpdate({userName }, updateData, { new: true });
  
      if (!tourGuide) {
        return res.status(404).json({ message: 'Tour Guide not found' });
      }
  
      return res.status(200).json(tourGuide);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  module.exports = {
    getTourGuideDetails,
    updateTourGuideDetails
  };
