const express = require("express");
const {getProducts, sortProducts, filterProducts, findProduct}= require('../Controllers/Products/TAScontroller');
const {createProduct, editProduct, ViewMyProducts}= require('../Controllers/Products/AScontroller');
const sellerModel = require('../Models/sellerModel')
const { getProductById } = require('../Controllers/Products/TAScontroller'); // Adjust path if necessary


const upload = require("../Controllers/uploadMiddleware");

const addSeller = async (req, res) => {
  const { email, userName, password, name, description } = req.body;
  try {
    const seller = await sellerModel.create({
      email,
      userName,
      password,
      name,
      description,
    });
    res.status(200).json(seller);
  } catch (error) {
    res.status(400).send("error");
  }
};

const router = express.Router();

router.get("/getProducts",getProducts);
router.post("/addSeller",addSeller);
router.get("/product/:productId", getProductById);
router.get("/ViewMyProducts/:seller",ViewMyProducts);
//router.post("/createProducts", createProduct);

router.post("/createProducts", upload.single("picture"), createProduct);

router.post("/sortProducts", sortProducts);
router.get("/findProduct", findProduct);
router.get("/filterProducts", filterProducts);
router.put("/editProduct/:productId", editProduct);

module.exports = router;
