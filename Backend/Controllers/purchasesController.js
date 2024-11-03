const purchases = require("../Models/purchasesModel");
const productModel = require("../Models/productModel");

const getMyPurchases = async (req, res) => {
  try {
    const purchases = await purchases.find({ buyer: req.params.buyer });
    res.status(200).json(purchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePurchase = async (req, res) => {
  const { products } = req.body;
  try {
    const buyer = await purchases.findOneAndUpdate(
      {
        buyer: req.params.buyer,
      },
      { products: products },
      { new: true }
    );
    if (!buyer) {
      return res.status(404).json({ message: "Buyer not found" });
    }
    const product = await productModel.findOneAndUpdate({ name: product.name });
    res.status(200).json(updatedTag);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getMyPurchases,
  updatePurchase,
};
