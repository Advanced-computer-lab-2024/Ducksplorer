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
  const{name, price, ratings, picture, availableQuantity, description, seller, reviews}= req.body;
  const id = req.params.id;
  if(!mongoose.Types.ObjectId.isValid(id))
     return res.status(404).send('ID DNE')
  const product= await productModel.findByIdAndUpdate({ _id:mongoose.Types.ObjectId(id) },{
     ...req.body
  });
  if(!user){
     return res.status(404).send('No user with that id');
  }
  return res.status(200).json(product);

}

module.exports = { createProduct, editProducts};