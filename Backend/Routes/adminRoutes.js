const express = require("express");
const {
  getProducts,
  filterProducts,
  findProduct,
} = require("../Controllers/Products/TAScontroller");
const {
  createProduct,
  editProduct,
} = require("../Controllers/Products/AScontroller");
const { sortProducts } = require("../Controllers/TAScontroller");
const upload = require("../Controllers/uploadMiddleware");

const router = express.Router();

router.get("/getproducts", getProducts);

//router.post("/createProducts", createProduct);

router.post("/createProducts", upload.single("picture"), createProduct); //done but not tested
router.get("/sortProducts", sortProducts); //done
router.get("/findProduct", findProduct); //done
router.get("/filterProducts", filterProducts); //done
router.put("/editProduct", editProduct); //done but el

module.exports = router;
