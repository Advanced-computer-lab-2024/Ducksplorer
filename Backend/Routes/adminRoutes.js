const express = require("express");
const {getProducts, sortProducts, filterProducts, findProduct}= require('../Controllers/Products/TAScontroller');
const {createProduct, editProduct,}= require('../Controllers/Products/AScontroller');

const router = express.Router();

router.get("/getproducts",getProducts);
router.post("/createProducts", createProduct);
router.get("/sortProducts", sortProducts);
router.get("/findProduct", findProduct);
router.get("/filterProducts", filterProducts);
router.put("/editProduct", editProduct);

module.exports = router;