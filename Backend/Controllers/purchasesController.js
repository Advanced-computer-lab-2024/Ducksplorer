const purchases = require("../Models/purchasesModel");
const Product = require("../Models/productModel");
const PurchaseBooking = require("../Models/purchaseBookingModel");

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

const purchaseProduct = async (req, res) => {
  const { buyer } = req.params; // Username of buyer
  const { productId, quantity } = req.body;

  try {
    // Validate input
    if (!productId || !quantity) {
      return res.status(400).json({ message: "Product ID and quantity are required" });
    }

    // Fetch the product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Create the purchase booking
    const currentDate = new Date();
    const newProductBooking = await PurchaseBooking.create({
      product: productId, // Reference the product
      buyer: buyer,
      chosenDate: currentDate,
      chosenPrice: product.price, // Use the fetched product's price
      chosenQuantity: quantity,
    });

    res.status(200).json(newProductBooking);
  } catch (error) {
    console.error("Error purchasing product:", error);
    res.status(400).json({ message: error.message });
  }
};


module.exports = {
  getMyPurchases,
  updatePurchase,
  purchaseProduct
};
