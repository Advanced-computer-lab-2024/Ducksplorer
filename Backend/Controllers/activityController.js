const Activity = require("../Models/activityModel.js");
const activityService = require("../Services/activityServices.js");
const Tags = require("../Models/preferenceTagsModels.js")
const Category = require("../Models/activityCategory.js");

const createActivity = async (req, res) => {
  try {
    const newActivity = await activityService.createActivity(req.body);
    res.status(201).json(newActivity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllActivitiesByUsername = async (req, res) => {
    try {
      const {advertiser}= req.params; // Change to username
      console.log(advertiser);
      const activities = await Activity.find({advertiser}); // Update the service method
      res.status(200).json(activities);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

const updateActivity = async (req, res) => {
  try {
    const activityId = req.params.activityId;
    const updatedData = req.body;
    const updatedActivity = await activityService.updateActivity(
      activityId,
      updatedData
    );
    res.status(200).json(updatedActivity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteActivity = async (req, res) => {
  try {
    const activityId = req.params.activityId;
    const deletedActivity = await activityService.deleteActivity(activityId);
    if (!deletedActivity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    res.status(200).json({ message: "Activity deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// const searchActivities = async (req, res) => {
//   const searchParams = req.query;
//   try {
//     const activities = await activityService.searchActivities(searchParams);
//     res.json(activities);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching activities" });
//   }
// };

// const searchActivities = async (req, res) => {
//     const { search } = req.query;
//     const filters = {};
  
//     if (search) {
//       filters.$or = [
//         { name: { $regex: search, $options: 'i' } }, // Search by name (case-insensitive)
//         { category: { $regex: search, $options: 'i' } }, // Search by category (case-insensitive)
//         { tags: { $regex: search, $options: 'i' } } // Search by tags (case-insensitive)
//       ];
//     }
  
//     try {
//       const activities = await Activity.find(filters);
//       res.status(200).json(activities);
//     } catch (error) {
//       res.status(400).json({ error: error.message });
//     }
//   };
const searchActivities = async (req, res) => {
    const { search } = req.query;
    const filters = {};
  
    try {
      // If the user is searching, check both the activity name, category, and related tags in respective schemas
      if (search) {
        // Find matching tags in the preferenceTagsSchema
        const matchingTags = await Tags.find({ name: { $regex: search, $options: 'i' } });
        const matchingTagNames = matchingTags.map(tag => tag.name); // Get array of matching tag names
        
        // Find matching categories in the Category schema
        const matchingCategories = await Category.find({ name: { $regex: search, $options: 'i' } });
        const matchingCategoryNames = matchingCategories.map(category => category.name); // Get array of matching category names
        
        console.log('Matching Tags:', matchingTagNames);
        console.log('Matching Categories:', matchingCategoryNames);
  
        // Construct the filters to include name, matching categories, and matching preference tags
        filters.$or = [
          { name: { $regex: search, $options: 'i' } } // Search by name (case-insensitive)
        ];
  
        // Only add the category filter if there are matching categories
        if (matchingCategoryNames.length > 0) {
          filters.$or.push({ category: { $in: matchingCategoryNames } }); // Search by matching category names
        }
  
        // Only add the tag filter if there are matching tags
        if (matchingTagNames.length > 0) {
          filters.$or.push({ tags: { $in: matchingTagNames } }); // Search by matching preference tags
        }
      }
  
      // Fetch the activities based on the search filters
      const activities = await Activity.find(filters);
      res.status(200).json(activities);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  
  
const viewUpcomingActivities = async (req, res) => {
  try {
    const upcomingActivities = await activityService.viewUpcomingActivities();
    res.json(upcomingActivities);
  } catch (error) {
    res.status(500).json({ message: "Error fetching upcoming activities" });
  }
};

// const filterActivities = async (req, res) => {
//   const { price, date, category, rating } = req.query;

//   try {
//     const activities = await activityService.filterActivities({
//       price,
//       date,
//       category,
//       rating,
//     });
//     res.json(activities); // Return activities as JSON
//   } catch (error) {
//     res.status(500).json({ message: "Error filtering activities" });
//   }
// };

const filterActivity = async (req, res) => {
  const { price, date, category, averageRating } = req.query;
  const filters = {};

  // Add filters based on query parameters
  if (price) filters.price = price;
  if (category) filters.category = category;

  // Handle the averageRating filter
  if (averageRating) {
    const numericRating = parseFloat(averageRating);
    if (!isNaN(numericRating) && numericRating >= 0 && numericRating < 5) {
      // Set the filters for average rating
      filters.averageRating = { $gte: numericRating, $lt: numericRating + 1 }; // 3 to 3.9, 4 to 4.9, etc.
    } else if (numericRating === 5) {
      // If the rating is 5, we just want to get those with an average rating of 5
      filters.averageRating = 5;
    } else {
      return res.status(400).json({ error: "Rating must be a number between 0 and 5." });
    }
  }

  // Get the current date and set time to midnight
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Set to midnight

  // If a date is provided in the query
  if (date) {
    const providedDate = new Date(date);
    providedDate.setHours(0, 0, 0, 0); // Set provided date to midnight

    // Define the start and end of the provided date
    const startDate = providedDate;
    const endDate = new Date(providedDate);
    endDate.setHours(23, 59, 59, 999); // Set end of the day to just before midnight

    // Ensure the provided date is greater than or equal to the current date
    if (providedDate >= currentDate) {
      // Filter for activities on the exact provided date range
      filters.date = { $gte: startDate, $lte: endDate };
    } else {
      return res.status(400).json({ error: "The provided date must be today or in the future." });
    }
  } else {
    // If no date is provided, filter for only upcoming activities
    filters.date = { $gte: currentDate };
  }

  try {
    const activities = await Activity.find(filters);
    res.status(200).json(activities);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

  
  
  
  
  
  
  
  
  
  
  
const sortActivities = async (req, res) => {
  const { sortBy, order } = req.query;
  const currentDate = new Date();

  let sortCriteria = {};
  if (sortBy) {
    sortCriteria[sortBy] = order === "desc" ? -1 : 1;
  }

  try {
    const activities = await Activity.find({
      date: { $gte: currentDate },
    }).sort(sortCriteria);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: "Error sorting activities" });
  }
};
const rateActivity = async (req, res) => {
    const { activityId } = req.params;
    const { rating } = req.body;
  
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Invalid rating. Please provide a rating between 1 and 5.' });
    }
  
    try {
      const activity = await Activity.findById(activityId);
      
      if (!activity) {
        return res.status(404).json({ message: 'Activity not found' });
      }
      activity.ratings.push(rating);
      const sum = activity.ratings.reduce((acc, val) => acc + val, 0);
      activity.averageRating = sum / activity.ratings.length;
      await activity.save();
  
      res.status(200).json({ message: 'Rating added successfully', activity });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

module.exports = {
  createActivity,
  getAllActivitiesByUsername,
  updateActivity,
  deleteActivity,
  searchActivities,
  viewUpcomingActivities,
  filterActivity,
  sortActivities,
  rateActivity
};
