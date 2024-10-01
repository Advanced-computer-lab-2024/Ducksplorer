const ActivityCategory = require('../../Models/activityCategory');

// Create a new activity category
const createCategory = async (req, res) => {
  const { name, activities } = req.body;
  try {
    const newCategory = new ActivityCategory({ name, activities });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getCategoriesbyName = async (req, res) => {
  try {
    const {name} = req.body;
    const categories = await ActivityCategory.find({name});
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an activity category
const updateCategory = async (req, res) => {
//   const { id } = req.params;
  const { name, activities } = req.body;
  try {
    const updatedCategory = await ActivityCategory.findOneAndUpdate({ name},{ activities }, { new: true });
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const deletedCategory = await ActivityCategory.findOneAndDelete(name);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCategory,
  getCategoriesbyName,
  updateCategory,
  deleteCategory,
};