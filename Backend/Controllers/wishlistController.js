const Wishlist = require("../Models/wishlistModel");
const Product = require("../Models/productModel");
const mongoose = require("mongoose");

const getMyWishlist = async (req, res) => { //tested done
    try {
      const myWishlist = await Wishlist.find({ username: req.params.username });
      res.status(200).json(myWishlist);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

const updateWishlist = async (req, res) => { //tested done
  const { username } = req.params;
  const { products } = req.body;

  try {
    const productExists = await Product.find({ _id: { $in: products } });
    if (productExists.length !== products.length) {
      return res.status(400).json({ message: "One or more products not found" });
    }

    // Find the existing wishlist or create one
    const updatedWishlist = await Wishlist.findOneAndUpdate(
      { username },
      { $addToSet: { products: { $each: products } } },
      { new: true, upsert: true } // `upsert` ensures a new wishlist is created if it doesn't exist
    ).populate("products");

    res.status(200).json(updatedWishlist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const removeFromWishlist = async (req, res) => {
  const { username , productId } = req.params;
  //const { productId } = req.body; // Ensure you pass `productId` from the frontend
  console.log("productId:", productId);
  console.log("username:", username);
  
  try {
    // const productObjectId = mongoose.Types.ObjectId(productId);
    // console.log("productObjectId:", productObjectId);
    const updatedWishlist = await Wishlist.findOneAndUpdate(
      { username },
      { $pull: { products: { _id: productId } } }, // Pull by product ID
      { new: true }
    );

    if (!updatedWishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    res.status(200).json(updatedWishlist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Controller to remove a product from the wishlist
// const removeFromWishlist = async (req, res) => {
//   try {
//     const { username, products } = req.body;

//     // Check if username and productId are provided
//     if (!username || !products) {
//       return res.status(400).json({ message: "Username and productId are required." });
//     }

//     // Find the wishlist of the given user
//     const wishlist = await Wishlist.findOne({ username });
//     if (!wishlist) {
//       return res.status(404).json({ message: "Wishlist not found for the specified user." });
//     }

//     // Remove the product with the given productId from the wishlist
//     const initialLength = wishlist.products.length;
//     wishlist.products = wishlist.products.filter(
//       (product) => product._id.toString() !== products
//     );

//     // Check if any product was actually removed
//     if (wishlist.products.length === initialLength) {
//       return res.status(404).json({ message: "Product not found in the wishlist." });
//     }

//     // Save the updated wishlist
//     await wishlist.save();

//     return res.status(200).json({ message: "Product removed from wishlist successfully.", wishlist });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "An error occurred while removing the product from the wishlist.", error });
//   }
// };
 
  

module.exports = {
  getMyWishlist,
  updateWishlist,
  removeFromWishlist,
  };
