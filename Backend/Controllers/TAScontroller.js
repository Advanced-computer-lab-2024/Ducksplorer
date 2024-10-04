const mongoose = require('mongoose');
const productModel = require('../Models/productModel');
const { $regex } = require('sift');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: './uploads', // Directory to store uploaded images
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });


const getProducts  = async (req, res) => { //view all products
    try {
      const products = await productModel.find({}).sort({ createdAt: -1 });
  
      // Include the `picture` field in the response
      const productsWithImages = products.map(product => ({
        ...product.toObject(),
        picture: `/uploads/${product.picture}` // Assuming you're storing images in the 'uploads' directory
      }));
  
      res.status(200).json(productsWithImages);
    } catch (err) {
      res.status(400).json({ err: err.message });
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
    const name = parseFloat(req.query.name);

    if (!name) {
      return res.status(400).json('Please provide the name');
    }
  
    try {
      const product = await productModel.findOne({ name: { $regex: name, $options: 'i' } });
  
      if (!product) {
        return res.status(404).json('Product not found');
      }
  
      // Include the `picture` field in the response
      const productWithImage = {
        ...product.toObject(),
        picture: `/uploads/${product.picture}` // Assuming you're storing images in the 'uploads' directory
      };
  
      res.status(200).json(productWithImage);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
}


module.exports = {getProducts,findProduct,filterProducts,sortProducts};
