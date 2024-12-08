const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategoriesbyName,
  updateCategory,
  deleteCategory,
  getAllCategories,
} = require("../../Controllers/Admin/AdminActivity.js");

// Create a new activity category
router.post("/", createCategory);//done

// Get all activity categories
router.get("/", getCategoriesbyName); //done

// Get all activity categories
router.get("/all", getAllCategories); //done

// Update an activity category
router.put("/", updateCategory); //done 

// Delete an activity category
router.delete("/", deleteCategory); //done fixed BE

module.exports = router;
