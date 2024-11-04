const Seller = require('../Models/sellerModel.js');


const getSellerDetails = async (req, res) => {
  const { userName } = req.params;
  try {
    const seller = await Seller.findOne({ userName });

    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    return res.status(200).json(seller);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateSellerDetails = async (req, res) => {
  const userName = req.body.userName;
  const updateData = req.body;

  try {
    const seller = await Seller.findOneAndUpdate({ userName }, updateData, { new: true });

    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    return res.status(200).json(seller);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteMySellerAccount = async (req, res) => {
  try {
    // Get seller username from the route parameters
    const { userName } = req.params;

    //Find the seller by his username which is given as a parameter
    const seller = await Seller.findOne({ userName: userName });

    if (!seller) {
      return res.status(404).json({ error: 'Seller not found' });
    }
    //IMPORTANT For sprint 3: This method is missing the process of deleting the unpurchased products associated with this seller

    // Delete the seller account
    await Seller.findByIdAndDelete(seller._id);

    // Respond with a success message
    res.status(200).json({ message: "Seller account deleted successfully." });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
module.exports = {
  getSellerDetails,
  updateSellerDetails,
  deleteMySellerAccount
};