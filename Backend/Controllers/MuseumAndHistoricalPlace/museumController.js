const museumModel = require("../../Models/museumHistoricalPlaceModels/museumModel"); //to get out of our folder then out of the controller folder
const { default: mongoose } = require("mongoose"); //allows us to do the check of the id ta7t

// const addMuseum = async (req, res) => {
//     //add a new Museum to the database with
//     try {
//         const { description, pictures, location, ticketPrices, openingTime, closingTime, museumDate, museumName, museumCategory, tags, createdBy } = req.body;
//         const newMuseum = new museumModel({ description, pictures, location, ticketPrices, openingTime, closingTime, museumDate, museumName, museumCategory, tags, createdBy });
//         await newMuseum.save();

//         res.status(201).json({ message: "Museum created successfully", museum: newMuseum });
//     }
//     catch (error) {
//         res.status(400).json({ message: "Error creating Museum", error: error.message })
//     }
// }

//Create a new museum
const addMuseum = async (req, res) => {
  try {
    const {
      description,
      location,
      pictures,
      ticketPrices,
      openingTime,
      closingTime,
      museumDate,
      museumName,
      museumCategory,
      tags,
      createdBy,
    } = req.body;

    // Get the file paths from req.files
    //const pictures = req.body.map(file => file.path); // use this if u want file uploads but you will have to modify the frontend
    const picture = req.body.pictures;

    const newMuseum = new museumModel({
      description,
      picture,
      location,
      ticketPrices,
      openingTime,
      closingTime,
      museumDate,
      museumName,
      museumCategory,
      tags,
      createdBy,
    });

    await newMuseum.save();

    res.status(201).json({ message: "Museum created successfully", newMuseum });
  } catch (error) {
    res.status(400).json({
      message: "Error creating Museum and Historical Place",
      error: error.message,
    });
  }
};

//Retrieve ONLY one  Museum and Historical Place from the database
const getMuseum = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Museum ID" });
    }
    const museum = await museumModel.findById(id);
    if (!museum) {
      return res.status(404).json({ message: "Museum not found" });
    }
    res.status(200).json({ message: "Museum found successfully", museum });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving Museum", error: error.message });
  }
};

// Retrieve all Museums of SPECIFIC tourism governor from the database
const getAllMyMuseums = async (req, res) => {
  try {
    const { userName } = req.params;
    console.log(userName);
    const museum = await museumModel.find({ createdBy: userName });
    if (!museum) {
      return res.status(404).json({ message: "Museum not found" });
    }
    res.status(200).json(museum);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving Museum", error: error.message });
  }
};

// Retrieve all Museums
const getAllMuseums = async (req, res) => {
  try {
    const museum = await museumModel.find();
    if (!museum) {
      return res.status(404).json({ message: "Museum not found" });
    }
    res.status(200).json(museum);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving Museum", error: error.message });
  }
};

//Update a Museum in the database
const updateMuseum = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      description,
      pictures,
      location,
      ticketPrices,
      openingTime,
      closingTime,
      museumDate,
      museumName,
      museumCategory,
      tags,
      createdBy,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Museum ID" });
    }
    const updatedMuseum = await museumModel.findByIdAndUpdate(
      id,
      {
        description,
        pictures,
        location,
        ticketPrices,
        openingTime,
        closingTime,
        museumDate,
        museumName,
        museumCategory,
        tags,
        createdBy,
      },
      { new: true, runValidators: true }
    );
    if (!updatedMuseum) {
      return res.status(404).json({ message: "Museum not found" });
    }
    res.status(200).json(updatedMuseum);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating Museum ", error: error.message });
  }
};

//Delete a Museum from the database
const deleteMuseum = async (req, res) => {
  try {
    const { id } = req.params;
    //const { description, pictures, location, ticketPrices, openingTime, closingTime } = req.body;
    const deletedMuseum = await museumModel.findByIdAndDelete(id);
    if (!deletedMuseum) {
      return res.status(404).json({ message: "Museum not found" });
    }
    res.status(200).json({ message: "Museum deleted successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error deleting Museum ", error: error.message });
  }
};

// Get ALL upcoming museum visits
const getAllUpcomingMuseums = async (req, res) => {
  try {
    // Get the current date and time
    const currentDate = new Date();

    // Query for all visits where the date is in the future
    const upcomingMuseums = await museumModel.find({
      museumDate: { $gt: currentDate }, // Compare activityDate with current date
    });
    // Check if any upcoming places were found
    if (!upcomingMuseums) {
      return res.status(404).json({ message: "Museum not found" });
    }
    res
      .status(200)
      .json({ message: "upcoming Museum found successfully", upcomingMuseums });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving upcoming Museum",
      error: error.message,
    });
  }
};

//Search for a Historical Place by name,category or tag from the database
const searchMuseum = async (req, res) => {
  console.log("Request received for searchMuseum");
  try {
    // Destructuring 'name', 'category', and 'tag' from the query parameters in the URL.
    // These parameters are optional and will be used to search for museums or historical places.
    const { searchTerm } = req.query;

    // Initialize an empty 'query' object that will be used to build the MongoDB query.
    const searches = {};

    if (searchTerm) {
      searches["$or"] = [
        { museumName: { $regex: searchTerm, $options: "i" } },
        { museumCategory: { $regex: searchTerm, $options: "i" } },
        { tags: { $regex: searchTerm, $options: "i" } },
      ];
    }
    // If a 'name' is provided in the query parameters, add a search condition for the name.
    // We use $regex to perform a partial match and $options: 'i' to make the search case-insensitive.
    // if (name) {
    //     query.museumName = { $regex: name, $options: 'i' };
    // }

    // // If a 'category' is provided, add a search condition for the category.
    // // Similar to the name, we use $regex and case-insensitive search to find partial matches in the category field.
    // if (category) {
    //     query.museumCategory = { $regex: category, $options: 'i' };
    // }

    // // If a 'tag' is provided, add a search condition for the 'tags' field.
    // // It will search for partial matches in the 'tags' array field, also using case-insensitivity.
    // if (tag) {
    //     query.tags = { $regex: tag, $options: 'i' };
    // }

    // Perform the MongoDB query using the built 'query' object.
    const results = await museumModel.find(searches);

    // If no results are found, return a 404 (Not Found) response with a message.
    if (!results.length) {
      return res.status(200).json({ message: "No matching Museum found" });
    }
    res.status(200).json({ message: "Search results found", results });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error searching for Museum", error: error.message });
  }
};

//We don't use this anymore we use the method inside the controller of the historical place tag
// const createTags = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { tags } = req.body;  // Ensure tags are coming from req.body

//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({ message: "Invalid Museum and Historical Place ID" });
//         }
//         const museum = await museumModel.findById(id);
//         if (!museum) {
//             return res.status(404).json({ message: "Museum not found" });
//         }
//         // Concatenate the existing tags with the new ones
//         const updatedTags = museum.tags.concat(tags);
//         // Update only the 'tags' field
//         const updatedMuseum = await museumModel.findByIdAndUpdate(id, { tags: updatedTags }, { new: true, runValidators: false });
//         res.status(200).json({ message: "Tags updated successfully", updatedMuseum });
//     } catch (error) {
//         res.status(400).json({ message: "Error updating tags", error: error.message });
//     }
// };

// const filterByTags = async (req, res) => {
//     try {
//         // Get tags from request query
//         const { tags } = req.query;

//         // Ensure tags is provided and is an array
//         if (!tags) {
//             return res.status(400).json({ message: "Tags are required" });
//         }

//         console.log('Tags received:', tags);
//         // Split the tags string into an array (if it's a comma-separated string)
//         const tagsArray = Array.isArray(tags) ? tags : tags.split(',');
//         console.log('Processed tagsArray:', tagsArray);

//         // Build the query to filter by tags
//         const results = await museumModel.find({
//             tags: { $in: tagsArray } // Matches documents that contain any of the specified tags
//         });

//         // Check if any results were found
//         if (results.length === 0) {
//             return res.status(404).json({ message: "No Museum found with the specified tags" });
//         }

//         // Return found results
//         res.status(200).json({ message: "Results found", results });
//     } catch (error) {
//         res.status(500).json({ message: "Error retrieving Museum", error: error.message });
//     }
// };

//Filter by attribute tags in Database
const filterByTags = async (req, res) => {
  try {
    // Get tags from request query
    const { tags } = req.query;

    // Ensure tags is provided and is an array
    if (!tags) {
      return res.status(400).json({ message: "Tags are required" });
    }

    console.log("Tags received:", tags);
    // Split the tags string into an array (if it's a comma-separated string)
    const tagsArray = Array.isArray(tags) ? tags : tags.split(",");

    // Normalize the tags (to lower case)
    const normalizedTagsArray = tagsArray.map((tag) => tag.toLowerCase());

    // Find museums with matching tags
    const results = await museumModel.find({
      tags: { $in: normalizedTagsArray }, // Ensure the matching logic is correct
    });

    console.log("Results found:", results);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error filtering museums by tags:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  addMuseum,
  getMuseum,
  getAllMyMuseums,
  getAllMuseums,
  updateMuseum,
  deleteMuseum,
  getAllUpcomingMuseums,
  searchMuseum,
  filterByTags,
};
//must export so that we can reference them inside the routes folder
