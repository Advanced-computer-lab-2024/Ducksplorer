const mongoose = require('mongoose');
const productModel = require('../Models/productModel');
const { $regex } = require('sift');

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
  const price = parseFloat(req.body.price);
  try{
    const products = await productModel.find({price : {$lte : price}});
    if(!products){
      res.status(400).send("no products were found");
    }
    res.status(200).send(products);
  }catch(err){
    res.status(400).send(err.message);
  }
  

}


const findProduct  = async (req, res) => { //find based on products name
  const {name} = req.body;
  if(!name){
    res.status(400).json('please provide the name');
  }
  try{
    const products = await productModel.find({name : {$regex : name , $options : 'i'}});
    res.json(products);
  }catch(err){
    res.status(400).json(err.message);
  }
}

module.exports = {getProducts,findProduct,filterProducts,sortProducts};
