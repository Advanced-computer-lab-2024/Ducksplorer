const Tourist = require('../Models/touristModel.js');


 const getTouristDetails = async (req, res) => {
    const {userName} = req.body;
    try {
      const tourist = await Tourist.findOne({userName});
  
      if (!tourist){
        return res.status(404).json({ message: 'Tourist not found' });
      }

      return res.status(200).json(tourist);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

   const updateTouristDetails = async (req, res) => {
    const userName = req.body.userName;
    const updateData = req.body;
  
    try {
      const tourist = await Tourist.findOneAndUpdate({userName }, updateData, { new: true });
  
      if (!tourist) {
        return res.status(404).json({ message: 'Tourist not found' });
      }
  
      return res.status(200).json(tourist);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  module.exports = {
    getTouristDetails,
    updateTouristDetails
  };