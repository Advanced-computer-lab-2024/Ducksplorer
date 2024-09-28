const mongoose = require('mongoose');
const productModel = require('../Models/productModel');

const getProducts  = async (req, res) => { //view all products
  try{
    const products = await productModel.find({}).sort({createdAt: -1})
    if(! products){
      res.status(404).json("product not found");
    }
    res.status(200).json(products)
  }catch(err){
    res.status(400).json({err: err.message}); //400 ashan error aady
  }
}


const sortProducts  = async (req, res) => { //sort by rating products
}

const filterProducts  = async (req, res) => { //filter products by price 
}


const findProduct  = async (req, res) => { //find based on products name
}

module.exports = {getProducts,findProduct,filterProducts,sortProducts};
