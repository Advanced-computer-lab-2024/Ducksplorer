const mongoose = require('mongoose');
const productModel = require('../Models/productModel');
const sellerModel = require('../Models/sellerModel')
const { $options } = require('sift');


const createProduct  = async (req, res) => { //add new products
  const{name, price, ratings, picture, availableQuantity, description,seller,  reviews}= req.body;

  try{
    const product = await productModel.create({name, price, ratings, picture, availableQuantity, description,seller,  reviews});
    res.status(200).json(product)
  }catch(error){
      res.status(400).json({error:error.message})
  }

}
const editProduct = async (req, res) => {
  const productId = req.params.productId;
  const data = req.body;
  const editedData = {}
  if(data.name !== ''){
    editedData.name = data.name;
  }
  if(data.price !== ''){
    editedData.price = data.price;
  }
  if(data.availableQuantity !== ''){
    editedData.availableQuantity = data.availableQuantity;
  }
  if(data.picture !== ''){
    editedData.picture = data.picture;
  }
  if(data.description !== ''){
    editedData.description = data.description;
  }
  console.log(data);
  console.log(editedData);
  try {
    const product = await productModel.findByIdAndUpdate(
      productId,
      {$set: editedData},
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




const ViewMyProducts = async (req,res) => {
  try{
    const {seller} = req.params;
    const products = await productModel.find({seller});
    res.status(200).json(products);
  }catch(error){
    res.status(500).json({message: error.message});
  }
}
module.exports = { createProduct, editProduct, ViewMyProducts};