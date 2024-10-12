const express = require("express");
const {getProducts,findProduct,filterProducts,sortProducts}= require('../Controllers/Products/TAScontroller');
const { receiveLoyaltyPoints, redeemPoints } = require("../Controllers/paymentController");

const router = express.Router();

router.get("/getproducts",getProducts);
router.get("/findProduct", findProduct);
router.put("/sortProducts",sortProducts);
router.get("/filterProducts",filterProducts);
router.patch("/loyalty/:name/:userName",receiveLoyaltyPoints);
router.patch("/redeemPoints/:userName", redeemPoints);




module.exports = router;




