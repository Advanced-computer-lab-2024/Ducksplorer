const express = require("express");
const {getProducts, sortProducts, filterProducts, findProduct}= require('../Controllers/TAScontroller');
const {createProduct, editProduct,}= require('../Controllers/AScontroller');

const router = express.Router();

router.get("/getproducts",getProducts);
router.post("/createproducts", createProduct);
router.post("/sortProducts", sortProducts);
router.get("/findProduct", findProduct);
router.get("/filterProducts", filterProducts);
router.put("/editProduct", editProduct);

module.exports = router;