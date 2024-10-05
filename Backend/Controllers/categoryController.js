const Category = require ("../Models/activityCategory.js");

const getAllCategories = async (req,res) =>{
    try{
        const categories = await Category.find().select('name'); // Fetch only the category names
        res.status(200).json(categories);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching categories' });
      }
    };
module.exports = {getAllCategories};