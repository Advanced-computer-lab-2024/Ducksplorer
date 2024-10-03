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

const sortProducts = async (req, res) => {
  const ratings = req.body.ratings;

  try {
    const products = await productModel.find({});

    products.forEach(product => {
    product.averageRating = product.ratings.length > 0 ? ((product.ratings.reduce((sum, num) => sum + num, 0)) / product.ratings.length ): 0;
    });
    
    products.sort((a, b) => b.averageRating - a.averageRating);    
    
    res.status(200).send(products);
  } catch (error) {
    res.status(500).json({ error: error.message });               
  }
};

const filterProducts  = async (req, res) => { //filter products by price 
  const price = parseFloat(req.body.price);
  try{
    const products = await productModel.find({price : {$lte : price}}).sort({price : 1}); //lte means less than or equal
    if(!products){
      res.status(400).send("no products were found");
    }
    res.status(200).send(products);
  }catch(err){
    res.status(400).send(err.message);
  }
  

}


const findProduct  = async (req, res) => { //search based on products name
  const {name} = req.body;
  if(!name){
    res.status(400).json('please provide the name');
  }
  try{
    const products = await productModel.find({name : {$regex : name , $options : 'i'}}); //i means case insensitive, case-insensitive search for products by name
    res.json(products);
  }catch(err){
    res.status(400).json(err.message);
  }
}


module.exports = {getProducts,findProduct,filterProducts,sortProducts};
