const Advertiser = require('../Models/advertiserModel.js');


 const getAdvertiserDetails = async (req, res) => {
    const {userName} = req.params;
    try {
      const advertiser = await Advertiser.findOne({userName});
  
      if (!advertiser){
        return res.status(404).json({ message: 'Advertiser not found' });
      }

      return res.status(200).json(advertiser);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

   const updateAdvertiserDetails = async (req, res) => {
    const userName = req.body.userName;
    const updateData = req.body;
  
    try {
      const advertiser = await Advertiser.findOneAndUpdate({userName }, updateData, { new: true });
  
      if (!advertiser) {
        return res.status(404).json({ message: 'Advertiser not found' });
      }
  
      return res.status(200).json(advertiser);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  module.exports = {
    getAdvertiserDetails,
    updateAdvertiserDetails
  };
