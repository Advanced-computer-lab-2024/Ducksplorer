const express = require('express');
const router = express.Router();
const {
  createCategory,
  getCategoriesbyName,
  updateCategory,
  deleteCategory,
  getAllCategories
} = require('../../Controllers/Admin/AdminActivity.js');

// Create a new activity category
router.post('/', createCategory);

// Get all activity categories
router.get('/', getCategoriesbyName);

// Get all activity categories
router.get('/all', getAllCategories);

// Update an activity category
router.put('/', updateCategory);

// Delete an activity category
router.delete('/', deleteCategory);

module.exports = router;