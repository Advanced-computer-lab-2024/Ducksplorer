// #Task route solution
const museumHistoricalPlaceModel = require('../../Models/museumHistoricalPlaceModel');//to get out of our folder then out of the controller folder
const { default: mongoose } = require('mongoose');//allows us to do the check of the id ta7t
// file created to contain all functions that the routes will reference instead of hard coding them in the routes folder


// const addMuseumHistoricalPlace = async (req, res) => {
//     //add a new Museum or Hist Place to the database with 
//     //description, pictures, location, ticketPrices, openingTime, closingTime
//     try {
//         const { description, pictures, location, ticketPrices, openingTime, closingTime, museumHistoricalPlaceDate, museumHistoricalPlaceName, museumHistoricalPlaceCategory, tags, createdBy } = req.body;
//         const newMuseumHistoricalPlace = new museumHistoricalPlaceModel({ description, pictures, location, ticketPrices, openingTime, closingTime, museumHistoricalPlaceDate, museumHistoricalPlaceName, museumHistoricalPlaceCategory, tags, createdBy });
//         await newMuseumHistoricalPlace.save();

//         res.status(201).json({ message: "Museum and Historical Place created successfully", museumHistoricalPlace: newMuseumHistoricalPlace });
//     }
//     catch (error) {
//         res.status(400).json({ message: "Error creating Museum and Historical Place", error: error.message })
//     }
// }




const addMuseumHistoricalPlace = async (req, res) => {
    try {
        const { description, location, ticketPrices, openingTime, closingTime, museumHistoricalPlaceDate, museumHistoricalPlaceName, museumHistoricalPlaceCategory, tags, createdBy } = req.body;

        // Get the file paths from req.files
        //const pictures = req.body.map(file => file.path); //di bete3mel error
        const pictures = req.body.pictures;

        const newMuseumHistoricalPlace = new museumHistoricalPlaceModel({
            description,
            pictures,
            location,
            ticketPrices,
            openingTime,
            closingTime,
            museumHistoricalPlaceDate,
            museumHistoricalPlaceName,
            museumHistoricalPlaceCategory,
            tags,
            createdBy
        });

        await newMuseumHistoricalPlace.save();

        res.status(201).json({ message: "Museum and Historical Place created successfully", museumHistoricalPlace: newMuseumHistoricalPlace });
    }
    catch (error) {
        res.status(400).json({ message: "Error creating Museum and Historical Place", error: error.message });
    }
}


const getMuseumHistoricalPlace = async (req, res) => {
    //retrieve ONLY one  Museum and Historical Place from the database
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Museum and Historical Place ID" });
        }
        const museumHistoricalPlace = await museumHistoricalPlaceModel.findById(id);
        if (!museumHistoricalPlace) {
            return res.status(404).json({ message: "Museum and Historical Place not found" });
        }
        res.status(200).json({ message: "Museum and Historical Place found successfully", museumHistoricalPlace });
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving Museum and Historical Place", error: error.message })
    }
}

const getAllMuseumHistoricalPlace = async (req, res) => {
    // Retrieve all Museums and Historical Places from the database
    try {
        const { createdBy } = req.params; // Extracting _id from request parameters

        // Use findById directly with the extracted _id
        const museumHistoricalPlace = await museumHistoricalPlaceModel.find({ createdBy });

        if (!museumHistoricalPlace) {
            return res.status(404).json({ message: "Museum and Historical Place not found" });
        }

        // res.status(200).json({ message: "Museum and Historical Place found successfully", museumHistoricalPlace });
        res.status(200).json(museumHistoricalPlace);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving Museum and Historical Place", error: error.message });
    }
};



const updateMuseumHistoricalPlace = async (req, res) => {
    //update a Museum and Historical Place in the database
    try {
        const { id } = req.params;
        const { description, pictures, location, ticketPrices, openingTime, closingTime, museumHistoricalPlaceDate, museumHistoricalPlaceName, museumHistoricalPlaceCategory, tags, createdBy } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Museum and Historical Place ID" });
        }

        const updatedMuseumHistoricalPlace = await museumHistoricalPlaceModel.findByIdAndUpdate(id, { description, pictures, location, ticketPrices, openingTime, closingTime, museumHistoricalPlaceDate, museumHistoricalPlaceName, museumHistoricalPlaceCategory, tags, createdBy }, { new: true, runValidators: true });

        if (!updatedMuseumHistoricalPlace) {
            return res.status(404).json({ message: "Museum and Historical Place not found" });
        }

        //res.status(200).json({ message: "Museum and Historical Place updated successfully", MuseumHistoricalPlace: updatedMuseumHistoricalPlace })
        res.status(200).json(updatedMuseumHistoricalPlace)

    }

    catch (error) {
        res.status(400).json({ message: "Error updating Museum and Historical Place", error: error.message })
    }
}

const deleteMuseumHistoricalPlace = async (req, res) => {
    //delete a Museum and Historical Place from the database
    try {
        const { id } = req.params;
        const { description, pictures, location, ticketPrices, openingTime, closingTime } = req.body;
        const deletedMuseumHistoricalPlace = await museumHistoricalPlaceModel.findByIdAndDelete(id);

        if (!deletedMuseumHistoricalPlace) {
            return res.status(404).json({ message: "Museum and Historical Place not found" });
        }

        //res.status(200).json({ message: "Museum and Historical Place deleted successfully", museumHistoricalPlace: deletedMuseumHistoricalPlace })
        res.status(200).json(deletedMuseumHistoricalPlace)

    }

    catch (error) {
        res.status(400).json({ message: "Error deleting Museum and Historical Place", error: error.message })
    }
}



// Method to get ALL upcoming visits
const getAllUpcomingMuseumHistoricalPlace = async (req, res) => {
    try {
        // Get the current date and time
        const currentDate = new Date();

        // Query for all visits where the date is in the future
        const upcomingMuseumHistoricalPlace = await museumHistoricalPlaceModel.find({
            museumHistoricalPlaceDate: { $gt: currentDate } // Compare activityDate with current date
        });
        // Check if any upcoming places were found
        if (!upcomingMuseumHistoricalPlace) {
            return res.status(404).json({ message: "Museum and Historical Place not found" });
        }
        res.status(200).json({ message: "upcoming Museum and Historical Places found successfully", upcomingMuseumHistoricalPlace });

    } catch (error) {
        res.status(500).json({ message: "Error retrieving Museum and Historical Place", error: error.message })
    }
};

const searchMuseumHistoricalPlace = async (req, res) => {
    console.log("Request received for searchMuseumHistoricalPlace");
    try {
        // Destructuring 'name', 'category', and 'tag' from the query parameters in the URL.
        // These parameters are optional and will be used to search for museums or historical places.
        const { name, category, tag } = req.query;

        // Initialize an empty 'query' object that will be used to build the MongoDB query.
        let query = {};

        // If a 'name' is provided in the query parameters, add a search condition for the name.
        // We use $regex to perform a partial match and $options: 'i' to make the search case-insensitive.
        if (name) {
            query.museumHistoricalPlaceName = { $regex: name, $options: 'i' };
        }

        // If a 'category' is provided, add a search condition for the category.
        // Similar to the name, we use $regex and case-insensitive search to find partial matches in the category field.
        if (category) {
            query.museumHistoricalPlaceCategory = { $regex: category, $options: 'i' };
        }

        // If a 'tag' is provided, add a search condition for the 'tags' field.
        // It will search for partial matches in the 'tags' array field, also using case-insensitivity.
        if (tag) {
            query.tags = { $regex: tag, $options: 'i' };
        }

        // Perform the MongoDB query using the built 'query' object.
        // The 'find' method will search the 'museumHistoricalPlace' collection for documents that match the query.
        const results = await museumHistoricalPlaceModel.find(query);

        // If no results are found, return a 404 (Not Found) response with a message.
        if (results.length === 0) {
            return res.status(404).json({ message: "No matching Museum or Historical Place found" });
        }

        // If results are found, return a 200 (OK) response with the search results.
        res.status(200).json({ message: "Search results found", results });
    } catch (error) {
        // If any error occurs during the search process, catch the error and return a 500 (Internal Server Error) response.
        // The error message is sent along with the response for debugging.
        res.status(500).json({ message: "Error searching for Museum and Historical Place", error: error.message });
    }
};

const createTags = async (req, res) => {
    try {
        const { id } = req.params;
        const { tags } = req.body;  // Ensure tags are coming from req.body

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Museum and Historical Place ID" });
        }

        const museumHistoricalPlace = await museumHistoricalPlaceModel.findById(id);

        if (!museumHistoricalPlace) {
            return res.status(404).json({ message: "Museum and Historical Place not found" });
        }

        // Concatenate the existing tags with the new ones
        const updatedTags = museumHistoricalPlace.tags.concat(tags);

        // Update only the 'tags' field
        const updatedMuseumHistoricalPlace = await museumHistoricalPlaceModel.findByIdAndUpdate(id, { tags: updatedTags }, { new: true, runValidators: false });

        res.status(200).json({ message: "Tags updated successfully", museumHistoricalPlace: updatedMuseumHistoricalPlace });
    } catch (error) {
        res.status(400).json({ message: "Error updating tags", error: error.message });
    }
};

const filterByTags = async (req, res) => {
    try {
        // Get tags from request query
        const { tags } = req.query;

        // Ensure tags is provided and is an array
        if (!tags) {
            return res.status(400).json({ message: "Tags are required" });
        }

        // Split the tags string into an array (if it's a comma-separated string)
        const tagsArray = Array.isArray(tags) ? tags : tags.split(',');

        // Build the query to filter by tags
        const results = await museumHistoricalPlaceModel.find({
            tags: { $in: tagsArray } // Matches documents that contain any of the specified tags
        });

        // Check if any results were found
        if (results.length === 0) {
            return res.status(404).json({ message: "No Museum or Historical Places found with the specified tags" });
        }

        // Return found results
        res.status(200).json({ message: "Results found", results });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving Museum and Historical Places", error: error.message });
    }
};


module.exports = { addMuseumHistoricalPlace, getMuseumHistoricalPlace, getAllMuseumHistoricalPlace, updateMuseumHistoricalPlace, deleteMuseumHistoricalPlace, getAllUpcomingMuseumHistoricalPlace, searchMuseumHistoricalPlace, createTags, filterByTags };
//must export so that we can reference them inside the routes folder