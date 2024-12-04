const PurchaseBooking = require("../Models/purchaseBookingModel.js");

const getMyPurchases = async (req, res) => {
  try {
    const myPurchases = await PurchaseBooking.find({ buyer: req.params.buyer });
    res.status(200).json(myPurchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getGroupedPurchases = async (req, res) => {
  const { buyer } = req.params;

  try {
    const groupedPurchases = await PurchaseBooking.aggregate([
      // Step 1: Filter purchases by buyer
      { $match: { buyer } },

      // Step 2: Group by orderNumber
      {
        $group: {
          _id: "$orderNumber", // Group by orderNumber
          orderNumber: { $first: "$orderNumber" }, // Retain the orderNumber
          status: { $first: "$status" }, // Retain the status
          date: { $first: "$chosenDate" }, // Retain the earliest date
          totalQuantity: { $sum: "$chosenQuantity" }, // Sum the quantities in each order
          totalPrice: { $sum: "$chosenPrice" }, // Sum the prices in each order
        },
      },

      // Step 3: Sort by date (latest first)
      { $sort: { date: -1 } },
    ]);

    res.status(200).json(groupedPurchases);
  } catch (error) {
    console.error("Error fetching grouped purchases:", error);
    res.status(500).json({ message: "Error fetching grouped purchases" });
  }
};


// const getMyOrder = async (req, res) => {
//   const { orderNumber } = req.body;

//   if (!orderNumber) {
//     return res.status(400).json({ message: "Order number is required." });
//   }

//   try {
//     const order = await purchases.find({ orderNumber : orderNumber });

//     if (!order) {
//       return res.status(404).json({ message: "Order not found." });
//     }

//     res.status(200).json(order);
//   } catch (error) {
//     console.error("Error fetching products for the order:", error);
//     res.status(500).json({ message: "Error retrieving products.", error });
//   }
// };
const addPurchase = async (req, res) => {
  const { products } = req.body;
  try {
    const newPurchase = new PurchaseBooking({
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
    const myPurchases = await PurchaseBooking.findOneAndUpdate(
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
  getGroupedPurchases,
  cancelOrder,
  // getMyOrder,
};
