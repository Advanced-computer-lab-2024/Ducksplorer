const mongoose = require('mongoose');
const productModel = require('../Models/productModel');


const createProduct  = async (req, res) => { //add new products
  const{name, price, ratings, picture, availableQuantity, description, seller, reviews}= req.body;

  try{
    const product = await productModel.create({name, price, ratings, picture, availableQuantity, description, seller, reviews});
    res.status(200).json(product)
  }catch(error){
      res.status(400).json({error:error.message})
  }

}
const editProducts  = async (req, res) => { //edit detail and price 
}

module.exports = { createProduct, editProducts};