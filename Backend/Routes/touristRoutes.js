const express = require("express");
const {
  getProducts,
  findProduct,
  filterProducts,
  sortProducts,
  touristUpdateProduct,
} = require("../Controllers/Products/TAScontroller");

const {
  getMyPurchases,
  updatePurchase,
} = require("../Controllers/purchasesController");

const router = express.Router();

router.get("/getproducts", getProducts);
router.get("/findProduct", findProduct);
router.put("/sortProducts", sortProducts);
router.get("/filterProducts", filterProducts);
router.get("/myPurchases/:buyer", getMyPurchases);
router.put("/updatePurchases/:buyer", updatePurchase);
router.put("/updateProducts/:id", touristUpdateProduct);

module.exports = router;
