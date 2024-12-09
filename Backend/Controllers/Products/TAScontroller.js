const productModel = require("../../Models/productModel");
const PurchaseBooking = require("../../Models/purchaseBookingModel");
const purchases = require("../../Models/purchasesModel");

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

const getProductById = async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const sortProducts = async (req, res) => {
//   const sortingDecider = req.query.sortingDecider; // Get the sortingDecider from the query params

//   try {
//     const products = await productModel.find({}); // Fetch all products

//     // Calculate average rating for each product
//     products.forEach((product) => {
//       product.averageRating =
//         product.ratings.length > 0
//           ? product.ratings.reduce((sum, num) => sum + num, 0) /
//             product.ratings.length
//           : 0;
//     });

//     if (sortingDecider === "1") {
//       // Sort by average rating in descending order
//       products.sort((a, b) => b.averageRating - a.averageRating);
//     } else {
//       // Sort by average rating in ascending order
//       products.sort((a, b) => a.averageRating - b.averageRating);
//     }

//     res.status(200).send(products); // Send the sorted products back
//   } catch (error) {
//     res.status(500).json({ error: error.message }); // Handle any errors
//   }
// };

const sortProducts = async (req, res) => {
  try {
    // Get the sorting order from the query parameters (default to 'asc' if not provided)
    const { sortOrder } = req.query; // Accept 'asc' or 'desc'

    let sortCriteria = { averageRating: 1 }; // Default to ascending
    if (sortOrder && sortOrder === "desc") {
      sortCriteria = { averageRating: -1 }; // Descending order
    }

    // Fetch products and sort by averageRating
    const products = await productModel.find().sort(sortCriteria);

    // Return the sorted products
    return res.status(200).json({ products });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// const filterProducts = async (req, res) => {
//   const minPrice = parseFloat(req.query.minPrice);
//   const maxPrice = parseFloat(req.query.maxPrice);
//   if (maxPrice < minPrice) {
//     return res.send("maximum is smaller than minimum");
//   }

//   try {
//     const products = await productModel
//       .find({
//         price: { $gte: minPrice, $lte: maxPrice }, // gte means greater than or equal, lte means less than or equal
//       })
//       .sort({ price: 1 }); // Sort by price in ascending order

//     if (!products || products.length === 0) {
//       return res
//         .status(400)
//         .send("No products were found in the given price range.");
//     }

//     res.status(200).send(products);
//   } catch (err) {
//     res.status(400).send(err.message);
//   }
// };

const filterProducts = async (req, res) => {
  const minPrice = req.query.minPrice
    ? parseFloat(req.query.minPrice)
    : undefined;
  const maxPrice = req.query.maxPrice
    ? parseFloat(req.query.maxPrice)
    : undefined;

  // Validate input
  if (minPrice !== undefined && maxPrice !== undefined && maxPrice < minPrice) {
    return res
      .status(400)
      .send("Maximum price cannot be smaller than minimum price.");
  }

  // Build the query dynamically
  const query = {};
  if (minPrice !== undefined) {
    query.price = { ...query.price, $gte: minPrice };
  }
  if (maxPrice !== undefined) {
    query.price = { ...query.price, $lte: maxPrice };
  }

  try {
    const products = await productModel.find(query).sort({ price: 1 }); // Sort by price in ascending order

    if (!products || products.length === 0) {
      return res
        .status(404)
        .send("No products found for the given price range.");
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const findProduct = async (req, res) => {
  //search based on products name
  const name = req.query.name;
  console.log(name);
  // if (!name) {
  //   res.status(400).json("please provide the name");
  // }
  try {
    const products = await productModel.find({
      name: { $regex: name, $options: "i" },
    }); //i means case insensitive, case-insensitive search for products by name
    res.json(products);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

const touristUpdateProductRating = async (req, res) => {
  const productId = req.params.id;
  const { ratingstr, buyer } = req.body;
  const rating = Number(ratingstr);
  console.log("this is the req body", req.body);
  try {
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const ratingIndex = product.ratings.findIndex((r) => r.buyer === buyer);

    if (ratingIndex !== -1) {
      // Update the existing rating
      product.ratings[ratingIndex].rating = rating;
    } else {
      // Add a new rating if the user hasn't rated this product before
      product.ratings.push({ buyer, rating });
    }
    // Calculate the average rating
    if (product.ratings.length > 0) {
      const totalRatings = product.ratings.reduce(
        (sum, r) => sum + r.rating,
        0
      );
      product.averageRating = totalRatings / product.ratings.length;
    } else {
      product.averageRating = 0; // No ratings, so set to 0 or null
    }

    await product.save();

    // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // const purchase = await PurchaseBooking
    //   .findOne({ buyer: buyer })
      

    // if (!purchase) {
    //   return res.status(404).json({ message: "Purchase record not found." });
    // }

    // console.log("Purchase Record:", purchase);
    // const productIndex = purchase.products.findIndex((prod) => {
    //   console.log("Checking productId:", prod._id); // Log each productId for debugging
    //   return prod._id.toString() === productId; // Ensure productId is valid
    // });
    // if (productIndex === -1) {
    //   return res
    //     .status(404)
    //     .json({ message: "Product not found in purchase record." });
    // }

    // purchase.products[productIndex] = product;
    // await purchase.save();

    // return purchase;
  } catch (err) {
    res.status(400).json(err.message);
  }
};

const getProductRating = async (req, res) => {
  const productId = req.params.id;
  const buyer = req.params.buyer;
  try {
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const buyerRating = product.ratings.find(
      (rating) => rating.buyer === buyer
    );
    if (buyerRating) {
      res.status(200).json({ rating: buyerRating.rating });
    } else {
      res.status(404).json({ message: "Rating not found for this buyer" });
    }
  } catch (error) {
    console.error("Error fetching rating:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const touristUpdateProductReview = async (req, res) => {
  const productId = req.params.id;
  const { review, buyer } = req.body;
  console.log("this is the req body", req.body);
  try {
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.reviews.push({ buyer, review });
    await product.save();

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // const purchase = await purchases
    //   .findOne({ buyer: buyer })
    //   .populate("products");

    // if (!purchase) {
    //   return res.status(404).json({ message: "Purchase record not found." });
    // }

    // const productIndex = purchase.products.findIndex((prod) => {
    //   console.log("Checking productId:", prod._id); // Log each productId for debugging
    //   return prod._id.toString() === productId; // Ensure productId is valid
    // });
    // if (productIndex === -1) {
    //   return res
    //     .status(404)
    //     .json({ message: "Product not found in purchase record." });
    // }

    // purchase.products[productIndex] = product;
    // await purchase.save();
    res.status(200).json({ product });
   // return purchase;
  } catch (err) {
    res.status(400).json(err.message);
  }
};

module.exports = {
  getProducts,
  findProduct,
  filterProducts,
  sortProducts,
  touristUpdateProductRating,
  getProductRating,
  touristUpdateProductReview,
  getProductById,
};
