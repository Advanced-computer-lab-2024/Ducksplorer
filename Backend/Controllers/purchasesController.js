const purchases = require("../Models/purchasesModel");

const getMyPurchases = async (req, res) => {
  try {
    const myPurchases = await purchases.find({ buyer: req.params.buyer });
    res.status(200).json(myPurchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addPurchase = async (req, res) => {
  const { products } = req.body;
  try {
    const newPurchase = new purchases({
      buyer: req.params.buyer,
      products: products,
    });
    const savedPurchase = await newPurchase.save();
    res.status(200).json(savedPurchase);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updatePurchase = async (req, res) => {
  const buyer = req.params.buyer;
  const { products } = req.body;
  try {
    const myPurchases = await purchases.findOneAndUpdate(
      {
        buyer: buyer,
      },
      { $push: { products: { $each: products } } },
      { new: true }
    );
    if (!myPurchases) {
      addPurchase(req, res);
      return; // Exit the function
    }
    res.status(200).json(myPurchases);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getMyPurchases,
  updatePurchase,
};
