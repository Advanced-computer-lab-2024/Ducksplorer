const PurchaseBooking = require("../Models/purchaseBookingModel.js");
const Product = require("../Models/productModel.js");
const Tourist = require("../Models/touristModel.js");
const getMyPurchases = async (req, res) => {
  try {
    const myPurchases = await PurchaseBooking.find({ buyer: req.params.buyer });
    res.status(200).json(myPurchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderProducts = async (req, res) => {
  try {
    const { productId } = req.params; // Extract productId from request parameters

    // Fetch the product by its ID
    const product = await Product.findById(productId);

    // If the product doesn't exist, send a 404 response
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Respond with the product details
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);

    // Respond with a 500 status for server errors
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getPurchasesByOrderNumber = async (req, res) => {
  try {
    const { orderNumber } = req.params; // Assuming the order number is passed as a URL parameter
    const orderNumberNum = +orderNumber;
    // Validate input
    if (!orderNumber) {
      return res.status(400).json({ message: "Order number is required." });
    }

    // Query the database
    const purchases = await PurchaseBooking.find({
      orderNumber: orderNumberNum,
    }).select("product chosenQuantity");

    // Check if any purchases were found
    if (purchases.length === 0) {
      return res
        .status(404)
        .json({ message: "No purchases found with this order number." });
    }

    // Return the results
    res.status(200).json({ purchases });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error.", error });
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

const purchaseProduct = async (req, res) => {
  const { buyer } = req.params; // Username of buyer
  const { productId, quantity } = req.body;

  try {
    // Validate input
    if (!productId || !quantity) {
      return res
        .status(400)
        .json({ message: "Product ID and quantity are required" });
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

const cancelOrder = async (req, res) => {
  const { username, orderNumber } = req.params;
  const { totalPrice } = req.body;

  try {
    // Find the tourist
    const tourist = await Tourist.findOne({ userName: username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Find all purchase bookings for this order number
    const purchases = await PurchaseBooking.find({
      buyer: username,
      orderNumber: orderNumber,
    });

    if (!purchases || purchases.length === 0) {
      return res.status(404).json({ message: "No purchases found for this order number" });
    }

    // Update availableQuantity for each product
    for (const purchase of purchases) {
      const productId = purchase.product;

      // Fetch the product using its ID
      const product = await Product.findById(productId);
      if (!product) {
        console.warn(`Product with ID ${productId} not found`);
        continue; // Skip if the product doesn't exist
      }

      // Update the availableQuantity
      product.availableQuantity += purchase.chosenQuantity;
      await product.save(); // Save the updated product
    }

    // Delete the purchases
    const result = await PurchaseBooking.deleteMany({
      buyer: username,
      orderNumber: orderNumber,
    });

    // Update the tourist's wallet
    tourist.wallet += parseFloat(totalPrice);
    await tourist.save();

    res.status(200).json({
      message: "Order canceled successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while canceling the order",
      error: error.message,
    });
  }
};



module.exports = {
  getMyPurchases,
  updatePurchase,
  getGroupedPurchases,
  getPurchasesByOrderNumber,
  getOrderProducts,
  cancelOrder,
  // getMyOrder,
};
