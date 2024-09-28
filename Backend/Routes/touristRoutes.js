const express = require("express");
const {getProducts, sortProducts, filterProducts, findProduct}= require('../Controllers/TAScontroller');

const router = express.Router();

router.get("/getproducts",getProducts);



module.exports = router;




