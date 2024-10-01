const mongoose = require('mongoose');
const productModel = require('../Models/productModel');
const { $options } = require('sift');


const createProduct  = async (req, res) => { //add new products
  const{name, price, ratings, picture, availableQuantity, description, seller, reviews}= req.body;

  try{
    const product = await productModel.create({name, price, ratings, picture, availableQuantity, description, seller, reviews});
    res.status(200).json(product)
  }catch(error){
      res.status(400).json({error:error.message})
  }

}
const editProduct = async (req, res) => {
  const { name, namee, price, ratings, availableQuantity, picture, description, seller } = req.body;

  try {
      const product = await productModel.findOneAndUpdate(
          { name: { $regex: name, $options: 'i' } },
          { name: namee, price, ratings, availableQuantity, picture, description, seller },
          { new: true }
      );

      if (!product) {
          res.status(400).json('no product with this name');
      }

      res.status(200).json(product);
  } catch (err) {
      res.status(400).json(err.message);
  }
};
module.exports = { createProduct, editProduct};