const Cart = require("../../Models/cartModel");
const Product = require("../../Models/productModel");
const Tourist = require("../../Models/touristModel");
const PurchaseBooking = require("../../Models/purchaseBookingModel");
const mongoose = require("mongoose");
const touristModel = require("../../Models/touristModel");
const {
  createNotification,
} = require("../Notifications/NotificationsController");

const viewCart = async (req, res) => {
  try {
    const { userName } = req.params;
    console.log(userName);
    // Validate input
    if (!userName) {
      return res.status(400).json({ message: "UserName is required." });
    }

    // Find the cart for the given userName and populate product details
    const cart = await Cart.findOne({ username: userName }).populate(
      "products.product"
    );

    if (!cart) {
      return res
        .status(200)
        .json({ message: "Cart is empty", cart: null });
    }

    // Respond with the cart details, including populated products
    res.status(200).json({ message: "Cart retrieved successfully.", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error.", error });
  }
};

const addProductToCart = async (req, res) => {
  try {
    const { userName, productId } = req.body;
    console.log(userName, productId);
    // Validate input
    if (!userName || typeof userName !== "string") {
      console.log("is this the issue?");
      return res.status(400).json({ message: "Invalid or missing username." });
    }
    if (!userName || !productId) {
      console.log("or this?");
      return res
        .status(400)
        .json({ message: "Username and Product ID are required." });
    }

    // Ensure the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }


    // Find or create the cart
    let cart = await Cart.findOne({ username: userName });
    if (!cart) {
      await createCart(req, res);
      return;
    }

    if (cart.products) {
      cart.products.push({ product: productId, quantity: 1 });

      // // Check if the product is already in the cart
      // const productIndex = cart.products.findIndex(
      //   (item) => item.product.toString() === productId
      // );

      // if (productIndex !== -1) {
      //   // add the quantity to the quantity existing if already there
      //   cart.products[productIndex].quantity += quantity;
      // } else {
      //   // Add the product to the cart
      // }
    }
    console.log("cart is", cart);

    // Save the cart
    //await cart.save();

    await Cart.updateOne(
      { _id: cart._id },
      { $set: { products: cart.products } }
    );

    res
      .status(200)
      .json({ message: "Product added to cart successfully.", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error.", error });
  }
};

const createCart = async (req, res) => {
  const { userName, productId} = req.body;
  console.log("req body inside", userName);
  try {

    console.log("before create");

    const newCart = new Cart({
      username: userName,
      products: [],
    });

    newCart.products.push({ product: productId, quantity: 1 });
    const cart = await newCart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.log("maybe here?");
    console.log(error);

    res.status(400).json(error);
  }
};

const removeProductFromCart = async (req, res) => {
  try {
    const { userName, productId } = req.query;
    console.log(productId, userName);
    // Validate input
    if (!userName || !productId) {
      return res
        .status(400)
        .json({ message: "UserName and Product ID are required." });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ username: userName });
    if (!cart) {
      return res
        .status(404)
        .json({ message: "Cart not found for the given userName." });
    }

    // Find the product index in the cart
    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (productIndex === -1) {
      return res
        .status(404)
        .json({ message: "Product not found in the cart." });
    }

    // Remove the product from the cart
    cart.products.splice(productIndex, 1);

    // Save the updated cart
    await cart.save();

    res
      .status(200)
      .json({ message: "Product removed from cart successfully.", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error.", error });
  }
};

const updateProductQuantity = async (req, res) => {
  try {
    const { userName, productId } = req.body;
    const newQuantity = Number(req.body.newQuantity); // Converts to a number

    // Validate input
    if (!userName || !productId || newQuantity === undefined) {
      return res.status(400).json({
        message: "UserName, Product ID, and new quantity are required.",
      });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ username: userName });
    if (!cart) {
      return res
        .status(404)
        .json({ message: "Cart not found for the given userName." });
    }

    // Find the product in the cart
    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (productIndex === -1) {
      return res
        .status(404)
        .json({ message: "Product not found in the cart." });
    }

    cart.products[productIndex].quantity = newQuantity;

    // Save the updated cart
    await cart.save();

    res
      .status(200)
      .json({ message: "Product quantity updated successfully.", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error.", error });
  }
};

const addPurchase2 = async (req, res) => {
  try {
    const { userName, productId, chosenQuantity, orderNumber } = req.body;

    // Validate request body
    if (!userName || !productId || !chosenQuantity || !orderNumber) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const chosenQuantitynum = +chosenQuantity;
    // Find the product by ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.availableQuantity < chosenQuantitynum) {
      return res.status(400).json({ error: "Insufficient stock available." });
    }

    // Calculate the total price for the quantity
    const chosenPrice = product.price * chosenQuantitynum;

    product.availableQuantity -= chosenQuantitynum;
    product.sales = (product.sales || 0) + chosenPrice;

    if(product.availableQuantity === 0){
      await createNotification(
        `Product ${product.name} is out of stock`,
        product.seller,
        'Out of stock'
      )
    }

    await product.save();

    // Create a new purchase booking
    const newPurchase = new PurchaseBooking({
      buyer: userName,
      product: productId,
      chosenDate: new Date(), // Current date
      chosenPrice,
      chosenQuantity,
      orderNumber,
    });

    // Save the purchase booking to the database
    await newPurchase.save();

    // Respond with success
    res.status(201).json({
      message: "Purchase successfully recorded!",
      purchase: newPurchase,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the purchase." });
  }
};



const getMyOrders = async (req, res) => {
  try {
    const myPurchases = await PurchaseBooking.find({ buyer: req.params.buyer }).populate("product");
    res.status(200).json(myPurchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAddresses = async (req, res) => {
  try{
    const tourist = await touristModel.findOne({userName: req.params.userName});
    if(!tourist){
      return res.status(400).json({message: "tourist not found"});
    }
    return res.status(200).json(tourist.addresses);
  }
  catch(error){
    return res.status(500).json({ message: error.message });
  }
}

const addAddress = async (req, res) => {
  try{
    const { street, city, state, postalCode, country } = req.body;
    if (!street || !city || !postalCode || !country || !state) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    const tourist = await touristModel.findOne({ userName: req.params.userName });
    if (!tourist) return res.status(404).json({ error: "Tourist not found" });

    // Add the new address
    tourist.addresses.push({ street, city, state, postalCode, country });

    // Save the updated document
    await tourist.save();

    return res.status(200).json({ message: "Address added successfully", addresses: tourist.addresses });
  }
  catch(error){
    return res.status(400).json(error);
  }
}

const emptyCart = async (req, res) => {
  const { userName } = req.body;
  try{
    const cart = await Cart.findOne({ username: userName });
    if(!cart){
      return res.status(404).json({error: "cart not found"});
    }
    await Cart.deleteOne({ _id: cart._id });
    return res.status(200).json({ message: "cart deleted successfully" });
  }
  catch(error){
    return res.status(400).json(error);
  }
}

module.exports = {
  addProductToCart,
  removeProductFromCart,
  updateProductQuantity,
  viewCart,
  addPurchase2,
  getMyOrders,
  getAddresses,
  addAddress,
  emptyCart
};
