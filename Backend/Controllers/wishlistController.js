const Wishlist = require("../Models/wishlistModel");
const Product = require("../Models/productModel");

const getMyWishlist = async (req, res) => {
    try {
      const myWishlist = await Wishlist.find({ username: req.params.username });
      res.status(200).json(myWishlist);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

const updateWishlist = async (req, res) => {
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
    const { username } = req.params; // Get the username from the URL
    const { products } = req.body; // Get the product ID from the request body
    const productObjectId = mongoose.Types.ObjectId(products);
  
    try {
      // Find and update the wishlist by removing the specified product ID
      const updatedWishlist = await Wishlist.findOneAndUpdate(
        { username }, // Find the wishlist by username
        { $pull: { products: productObjectId } }, // Remove the product ID from the 'products' array
        { new: true } // Return the updated document
      ).populate("products"); // Populate product details
  
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
