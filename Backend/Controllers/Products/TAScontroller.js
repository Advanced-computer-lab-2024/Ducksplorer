const mongoose = require("mongoose");
const productModel = require("../../Models/productModel");
const { $regex } = require("sift");

const getProducts = async (req, res) => {
  //view all products
  try {
    const products = await productModel.find({}).sort({ createdAt: -1 });
    if (!products) {
      res.status(404).json("product not found");
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(400).json({ err: err.message }); //400 ashan error aady
  }
};

const sortProducts = async (req, res) => {
  const sortingDecider = req.query.sortingDecider; // Get the sortingDecider from the query params

  try {
    const products = await productModel.find({}); // Fetch all products

    // Calculate average rating for each product
    products.forEach((product) => {
      product.averageRating =
        product.ratings.length > 0
          ? product.ratings.reduce((sum, num) => sum + num, 0) /
            product.ratings.length
          : 0;
    });

    if (sortingDecider === "1") {
      // Sort by average rating in descending order
      products.sort((a, b) => b.averageRating - a.averageRating);
    } else {
      // Sort by average rating in ascending order
      products.sort((a, b) => a.averageRating - b.averageRating);
    }

    res.status(200).send(products); // Send the sorted products back
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle any errors
  }
};

const filterProducts = async (req, res) => {
  const minPrice = parseFloat(req.query.minPrice);
  const maxPrice = parseFloat(req.query.maxPrice);
  if (maxPrice < minPrice) {
    return res.send("maximum is smaller than minimum");
  }

  try {
    const products = await productModel
      .find({
        price: { $gte: minPrice, $lte: maxPrice }, // gte means greater than or equal, lte means less than or equal
      })
      .sort({ price: 1 }); // Sort by price in ascending order

    if (!products || products.length === 0) {
      return res
        .status(400)
        .send("No products were found in the given price range.");
    }

    res.status(200).send(products);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const findProduct = async (req, res) => {
  //search based on products name
  const name = req.query.name;
  console.log(name);
  if (!name) {
    res.status(400).json("please provide the name");
  }
  try {
    const products = await productModel.find({
      name: { $regex: name, $options: "i" },
    }); //i means case insensitive, case-insensitive search for products by name
    res.json(products);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

const touristUpdateProduct = async (req, res) => {
  const productId = req.params.id;
  const { rating, review } = req.body;
  try {
    const updatedProduct = await productModel.findByIdAndUpdate(
      { _id: productId },
      { $push: { rating: rating }, $push: { reviews: review } },
      {
        new: true,
      }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

module.exports = {
  getProducts,
  findProduct,
  filterProducts,
  sortProducts,
  touristUpdateProduct,
};
