// file created to contain all functions that the routes will reference instead of hard coding them in the routes folder
const historicalPlaceModel = require('../../Models/museumHistoricalPlaceModels/historicalPlaceModel');//to get out of our folder then out of the controller folder
const touristModel = require('../../Models/touristModel');
const { default: mongoose } = require('mongoose');//allows us to do the check of the id ta7t



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

// Create a new historical place
const addHistoricalPlace = async (req, res) => {
    try {
        const { description, location, ticketPrices, openingTime, closingTime, HistoricalPlaceDate, HistoricalPlaceName, HistoricalPlaceCategory, tags, createdBy } = req.body;

        // Get the file paths from req.files
        //const pictures = req.body.map(file => file.path); //di bete3mel error
        const pictures = req.body.pictures;

        const newHistoricalPlace = new historicalPlaceModel({
            description,
            pictures,
            location,
            ticketPrices,
            openingTime,
            closingTime,
            HistoricalPlaceDate,
            HistoricalPlaceName,
            HistoricalPlaceCategory,
            tags,
            createdBy
        });

        await newHistoricalPlace.save();

        res.status(201).json({ message: " Historical Place created successfully", newHistoricalPlace });
    }
    catch (error) {
        res.status(400).json({ message: "Error creating Historical Place", error: error.message });
    }
}

//Retrieve ONLY ONE  Historical Place from the database
const getHistoricalPlace = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Historical Place ID" });
        }
        const HistoricalPlace = await historicalPlaceModel.findById(id);
        if (!HistoricalPlace) {
            return res.status(404).json({ message: "Historical Place not found" });
        }
        res.status(200).json({ message: "Historical Place found successfully", HistoricalPlace });
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving Historical Place", error: error.message })
    }
}

// Retrieve all Historical Places of SPECIFIC tourism governor from the database
const getAllMyHistoricalPlaces = async (req, res) => {
    try {
        const { userName } = req.params;
        const HistoricalPlace = await historicalPlaceModel.find({ createdBy: userName });

        if (!HistoricalPlace) {
            return res.status(404).json({ message: "Historical Place not found" });
        }
        res.status(200).json(HistoricalPlace);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving Historical Place", error: error.message });
    }
};

// Retrieve all Historical Places from the database
const getAllHistoricalPlaces = async (req, res) => {
    const {showPreferences, role, username} = req.query;
    if(showPreferences === 'true' && role === 'Tourist'){
        const tourist =await touristModel.findOne({userName: username});
        const touristTags = tourist.historicalPlacestags;
        try{
            let HistoricalPlace = await historicalPlaceModel.find();
            console.log(HistoricalPlace[0].tags);
            HistoricalPlace = HistoricalPlace.sort((a, b) => {
                const aHasMatch = a.tags.some(tag => touristTags.includes(tag));
                const bHasMatch = b.tags.some(tag => touristTags.includes(tag));
                
                
                if (aHasMatch && !bHasMatch) {
                    return -1; // If 'a' has a match and 'b' doesn't, 'a' comes first
                  } else if (!aHasMatch && bHasMatch) {
                    return 1; // If 'b' has a match and 'a' doesn't, 'b' comes first
                  } else {
                    return 0; // If both have matches or both don't, retain their relative order
                  }            });
                res.status(200).json(HistoricalPlace);

        }catch (error){
            res.status(500).json({ message: "Error retrieving Historical Place", error: error.message });
        }
    }else{
        try {
            const HistoricalPlace = await historicalPlaceModel.find();
            if (!HistoricalPlace) {
                return res.status(404).json({ message: "Historical Place not found" });
            }
            res.status(200).json(HistoricalPlace);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving Historical Place", error: error.message });
        }
    }
    
};

// Update a Historical Place from the database
const updateHistoricalPlace = async (req, res) => {
    try {
        const { id } = req.params;
        const { description, pictures, location, ticketPrices, openingTime, closingTime, HistoricalPlaceDate, HistoricalPlaceName, HistoricalPlaceCategory, tags, createdBy } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Historical Place ID" });
        }
        const updatedHistoricalPlace = await historicalPlaceModel.findByIdAndUpdate(id, { description, pictures, location, ticketPrices, openingTime, closingTime, HistoricalPlaceDate, HistoricalPlaceName, HistoricalPlaceCategory, tags, createdBy }, { new: true, runValidators: true });
        if (!updatedHistoricalPlace) {
            return res.status(404).json({ message: "Historical Place not found" });
        }
        res.status(200).json(updatedHistoricalPlace)
    }
    catch (error) {
        res.status(400).json({ message: "Error updating Historical Place", error: error.message })
    }
}

//Delete a Historical Place from the database
const deleteHistoricalPlace = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedHistoricalPlace = await historicalPlaceModel.findByIdAndDelete(id);

        if (!deletedHistoricalPlace) {
            return res.status(404).json({ message: "Historical Place not found" });
        }

        //res.status(200).json({ message: "Museum and Historical Place deleted successfully", museumHistoricalPlace: deletedMuseumHistoricalPlace })
        res.status(200).json({message: "Historical Place deleted successfully"})

    }
    catch (error) {
        res.status(400).json({ message: "Error deleting Historical Place", error: error.message })
    }
}

// Get ALL upcoming historical place visits
const getAllUpcomingHistoricalPlaces = async (req, res) => {
    try {
        const currentDate = new Date();
        // Query for all visits where the date is in the future
        const upcomingHistoricalPlaces = await historicalPlaceModel.find({
            HistoricalPlaceDate: { $gt: currentDate } // Compare activityDate with current date
        });
        // Check if any upcoming places were found
        if (!upcomingHistoricalPlaces||upcomingHistoricalPlaces.length===0) {
            return res.status(404).json({ message: " No Upcoming Historical Places found" });
        }
        res.status(200).json({ message: "Upcoming Historical Places found successfully", upcomingHistoricalPlaces });

    } catch (error) {
        res.status(500).json({ message: "Error retrieving Historical Place", error: error.message })
    }
};

//Search for a Historical Place by name,category or tag from the database
const searchHistoricalPlace = async (req, res) => {
    console.log("Request received for searchHistoricalPlace");
    try {
        // Destructuring 'name', 'category', and 'tag' from the query parameters in the URL.
        // These parameters are optional and will be used to search for museums or historical places.
        const { searchTerm } = req.query;

        // Initialize an empty 'query' object that will be used to build the MongoDB query.
        const searches = {};

        if(searchTerm){
            searches['$or'] = [
                { HistoricalPlaceName : { $regex: searchTerm, $options: 'i' }},
                { HistoricalPlaceCategory : { $regex: searchTerm, $options: 'i' }},
                { tags : { $regex: searchTerm, $options: 'i' }}
            ];
        }

        // If a 'name' is provided in the query parameters, add a search condition for the name.
        // We use $regex to perform a partial match and $options: 'i' to make the search case-insensitive.
        // if (name) {
        //     query.HistoricalPlaceName = { $regex: name, $options: 'i' };
        // }

        // // If a 'category' is provided, add a search condition for the category.
        // // Similar to the name, we use $regex and case-insensitive search to find partial matches in the category field.
        // if (category) {
        //     query.HistoricalPlaceCategory = { $regex: category, $options: 'i' };
        // }

        // // If a 'tag' is provided, add a search condition for the 'tags' field.
        // // It will search for partial matches in the 'tags' array field, also using case-insensitivity.
        // if (tag) {
        //     query.tags = { $regex: tag, $options: 'i' };
        // }

        // Perform the MongoDB query using the built 'query' object.
        const results = await historicalPlaceModel.find(searches);

        if (!results.length) {
            return res.status(200).json({ message: "No matching Historical Place found" });
        }
        res.status(200).json({ message: "Search results found", results });

    } catch (error) {
        res.status(500).json({ message: "Error searching for Historical Place", error: error.message });
    }
};

//We don't use this anymore we use the method inside the controller of the historical place tag
// const createTags = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { tags } = req.body;
//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({ message: "Invalid Historical Place ID" });
//         }
//         const HistoricalPlace = await historicalPlaceModel.findById(id);
//         if (!HistoricalPlace) {
//             return res.status(404).json({ message: "Historical Place not found" });
//         }

//         // Concatenate the existing tags with the new ones
//         const updatedTags = HistoricalPlace.tags.concat(tags);

//         // Update only the 'tags' field
//         const updatedHistoricalPlace = await historicalPlaceModel.findByIdAndUpdate(id, { tags: updatedTags }, { new: true, runValidators: false });

//         res.status(200).json({ message: "Tags updated successfully", updatedHistoricalPlace });
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

//         // Split the tags string into an array (if it's a comma-separated string)
//         const tagsArray = Array.isArray(tags) ? tags : tags.split(',');

//         // Build the query to filter by tags
//         const results = await historicalPlaceModel.find({
//             tags: { $in: tagsArray } // Matches documents that contain any of the specified tags
//         });

//         // Check if any results were found
//         if (results.length === 0) {
//             return res.status(404).json({ message: "No Historical Places found with the specified tags" });
//         }

//         // Return found results
//         res.status(200).json({ message: "Results found", results });
//     } catch (error) {
//         res.status(500).json({ message: "Error retrieving Historical Places", error: error.message });
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

        console.log('Tags received:', tags);
        // Split the tags string into an array (if it's a comma-separated string)
        const tagsArray = Array.isArray(tags) ? tags : tags.split(',');

        // Normalize the tags (to lower case)
        const normalizedTagsArray = tagsArray.map(tag => tag.toLowerCase());

        // Find museums with matching tags
        const results = await historicalPlaceModel.find({
            tags: { $in: normalizedTagsArray } // Ensure the matching logic is correct
        });

        console.log('Results found:', results);
        res.status(200).json(results);
    } catch (error) {
        console.error('Error filtering Historical Places by tags:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { addHistoricalPlace, getHistoricalPlace, getAllMyHistoricalPlaces, getAllHistoricalPlaces, updateHistoricalPlace, deleteHistoricalPlace, getAllUpcomingHistoricalPlaces, searchHistoricalPlace, filterByTags };
//must export so that we can reference them inside the routes folder