const express = require("express");
const {getProducts, sortProducts, filterProducts, findProduct}= require('../Controllers/TAScontroller');
const {createProduct, editProduct, ViewMyProducts}= require('../Controllers/AScontroller');
const sellerModel = require('../Models/sellerModel')

const addSeller = async (req,res) => {
  const {email,userName,password,name,description} = req.body;
  try{
    const seller = await sellerModel.create({email,userName,password,name,description});
    res.status(200).json(seller)
  }catch(error){
    res.status(400).send("error");
  }
}

const router = express.Router();

router.get("/getProducts",getProducts);
router.post("/addSeller",addSeller);
router.get("/ViewMyProducts/:seller",ViewMyProducts);
router.post("/createProducts", createProduct);
router.post("/sortProducts", sortProducts);
router.get("/findProduct", findProduct);
router.get("/filterProducts", filterProducts);
router.put("/editProduct/:productId", editProduct);

module.exports = router;