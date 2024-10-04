const mongoose = require('mongoose');
const productModel = require('../Models/productModel');
const { $options } = require('sift');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: './uploads', // Directory to store uploaded images
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });


const createProduct  = async (req, res) => { //add new products
  const{name, price, ratings, picture, availableQuantity, description, seller, reviews}= req.body;

  try{
    const product = await productModel.create({name, price, ratings, picture, availableQuantity, description, seller, reviews});
   
    upload.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
  
      product.picture = `/uploads/${req.file.filename}`;
      await product.save();
    });  
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
    if (req.file) {
      product.picture = `/uploads/${req.file.filename}`;
    }
  
    await product.save();
    return res.status(200).json(product);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
module.exports = { createProduct, editProduct};