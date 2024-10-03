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
  const { id, name, price, availableQuantity, picture, description, seller } = req.body;

  try {
    const product = await productModel.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          price,
          availableQuantity,
          picture,
          description,
          seller
        }
      },
      { new: true }
    );

    if (!product) {
      return res.status(400).json({ error: 'No product with this ID' });
    }

    return res.status(200).json(product);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
module.exports = { createProduct, editProduct};