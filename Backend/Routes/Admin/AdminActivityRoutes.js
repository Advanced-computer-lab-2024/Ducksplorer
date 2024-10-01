const express = require('express');
const router = express.Router();
const {
  createCategory,
  getCategoriesbyName,
  updateCategory,
  deleteCategory,
} = require('../../Controllers/Admin/AdminActivity.js');

// Create a new activity category
router.post('/', createCategory);

// Get all activity categories
router.get('/', getCategoriesbyName);

// Update an activity category
router.put('/', updateCategory);

// Delete an activity category
router.delete('/', deleteCategory);

module.exports = router;