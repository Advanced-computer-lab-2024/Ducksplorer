const express = require("express");
const {getProducts, sortProducts, filterProducts, findProduct}= require('../Controllers/TAScontroller');
const {createProduct, editProducts}= require('../Controllers/AScontroller');

const router = express.Router();

router.get("/getproducts",getProducts);
router.post("/createproducts", createProduct);
router.post("/sortProducts", sortProducts);
router.get("/findProduct/:name", findProduct);
router.get("/filterProducts", filterProducts);
router.put("/editProducts", editProducts);

module.exports = router;