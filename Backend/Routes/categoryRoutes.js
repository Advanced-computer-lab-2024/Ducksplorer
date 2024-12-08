const express = require("express");
const categoryController = require("../Controllers/categoryController.js");

const router = express.Router();

router.route("/").get(categoryController.getAllCategories);//done

module.exports = router;