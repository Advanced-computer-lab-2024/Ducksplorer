const express = require("express");
const {getProducts, sortProducts, filterProducts, findProduct}= require('../Controllers/TAScontroller');
const { editProduct } = require("../Controllers/AScontroller");

const router = express.Router();

router.get("/getproducts",getProducts);
router.get("/findProduct", findProduct);
router.put("/editProduct",editProduct);
router.get("/filterProducts",filterProducts);


module.exports = router;




