const express = require("express");
const {getProducts,findProduct,filterProducts,sortProducts}= require('../Controllers/Products/TAScontroller');

const router = express.Router();

router.get("/getproducts",getProducts);
router.get("/findProduct", findProduct);
router.put("/sortProducts",sortProducts);
router.get("/filterProducts",filterProducts);


module.exports = router;




