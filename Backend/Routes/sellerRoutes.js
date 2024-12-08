const express = require("express");
const {
  getProducts,
  sortProducts,
  filterProducts,
  findProduct,
} = require("../Controllers/Products/TAScontroller");
const {
  createProduct,
  editProduct,
  ViewMyProducts,
} = require("../Controllers/Products/AScontroller");
const sellerModel = require("../Models/sellerModel");
const { getProductById } = require("../Controllers/Products/TAScontroller"); // Adjust path if necessary
const { viewMyProducts, filterMyProducts } = require("../Controllers/Reports/sellerReport");
const upload = require("../Controllers/uploadMiddleware");

const addSeller = async (req, res) => {
  const { email, userName, password, name, description } = req.body;
  try {
    const seller = await sellerModel.create({
      email,
      userName,
      password,
      name,
      description,
    });
    res.status(200).json(seller);
  } catch (error) {
    res.status(400).send("error");
  }
};

const router = express.Router();

router.get("/getProducts", getProducts);//done
router.post("/addSeller", addSeller); //WHAT IS THIS
router.get("/product/:productId", getProductById);//done
router.get("/report/:sellerName", viewMyProducts);//done
router.route("/filterReport/:sellerName").get(filterMyProducts);//done
router.get("/ViewMyProducts/:seller", ViewMyProducts);//done
//router.post("/createProducts", createProduct);

router.post("/createProducts", upload.single("picture"), createProduct);//done

router.post("/sortProducts", sortProducts);// WHY IS THIS POST, TEST THIS FE?
router.get("/findProduct", findProduct);//done
router.get("/filterProducts", filterProducts);//done
router.put("/editProduct/:productId", editProduct);//done

module.exports = router;
