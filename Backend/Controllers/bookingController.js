const mongoose = require('mongoose');
const Tourist = require("../Models/touristModel.js");
const Activity = require("../Models/activityModel.js");
const Bookings = require("../Models/bookingsModel.js");
const Itinerary = require("../Models/itineraryModel.js");

const createBooking = async (req, res) => {
    const { user } = req.params;  // Get the user from the URL parameters
    const { activityIds, itineraryIds } = req.body;  // Get the activity and itinerary IDs from the request body

    try {
        // Find the tourist by userName
        const tourist = await Tourist.findOne({ userName: user });

        if (!tourist) {
            return res.status(404).json({ message: "Tourist not found" });
        }

        if (!Array.isArray(activityIds) || !Array.isArray(itineraryIds)) {
            return res.status(400).json({ message: "Activity IDs and Itinerary IDs must be arrays" });
        }

        // Fetch the activities and itineraries by their IDs
        const activities = await Activity.find({ _id: { $in: activityIds } });
        const itineraries = await Itinerary.find({ _id: { $in: itineraryIds } });

        if (activities.length !== activityIds.length) {
            return res.status(404).json({ message: "One or more activities not found" });
        }

        if (itineraries.length !== itineraryIds.length) {
            return res.status(404).json({ message: "One or more itineraries not found" });
        }

        // Check if the user already has a booking
        let booking = await Bookings.findOne({ user: tourist._id });

        if (booking) {
            // If booking exists, update the activities and itineraries arrays
            const updatedActivities = [
                ...booking.activities,
                ...activities.filter(a => !booking.activities.some(existingActivity => existingActivity._id.equals(a._id))) // Avoid duplicates
            ];

            const updatedItineraries = [
                ...booking.itineraries,
                ...itineraries.filter(i => !booking.itineraries.some(existingItinerary => existingItinerary._id.equals(i._id))) // Avoid duplicates
            ];

            booking.activities = updatedActivities;
            booking.itineraries = updatedItineraries;

            await booking.save(); // Save the updated booking

            return res.status(200).json({ message: "Booking updated successfully", booking });

        } else {
            // If no booking exists, create a new one
            const newBooking = new Bookings({
                user: tourist._id,  
                activities,         
                itineraries       
            });

            await newBooking.save(); // Save the new booking

            return res.status(201).json(newBooking);
        }

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};




const viewMyUpcomingBookings = async (req, res) => {
    try {
      const { tourist } = req.query;
  
      if (!tourist) {
        return res.status(400).json({ message: "Tourist query parameter is required." });
      }
  
      const bookings = await Bookings.find({ user: tourist, date: { $gte: new Date() } });
  
      if (!bookings.length) {
        return res.status(404).json({ message: "No upcoming bookings found." });
      }
  
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

const viewMyPastBookings = async (req, res) => {
    try {
        const { tourist } = req.query;
    
        if (!tourist) {
          return res.status(400).json({ message: "Tourist query parameter is required." });
        }
    
        const bookings = await Bookings.find({ user: tourist, date: { $lt: new Date() } });
    
        if (!bookings.length) {
          return res.status(404).json({ message: "No upcoming bookings found." });
        }
    
        res.status(200).json(bookings);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}

const viewDesiredActivity = async (req, res) => {
    try {
        const {activityId} = req.params;
        const result = await Activity.find({_id : activityId});
        if (!result) {
            return res.status(404).json({ message: "Activity not found" });
          }
        res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const viewDesiredItinerary = async (req,res) => {
    try {
        //console.log(req.params);
        const { itineraryId } = req.params;
        const result = await Itinerary.findOne({_id : itineraryId});
        console.log(itineraryId);
        if (!result) {
            return res.status(404).json({ message: "Itinerary not found" });
          }
        res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
  
const getMyBookings = async (req, res) => {
    try {
        const { user } = req.params;

        // Find bookings by user and project only 'date' and 'type'
        const bookings = await Bookings.find({ user });

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const cancelMyBooking = async (req, res) => {
    const { user } = req.params; // User from the URL parameters
    const currentDate = new Date();
    const { bookingId, type, itemId } = req.body; // Take bookingId, type, and itemId from the body

    try {
        // Find the tourist by their ID
        const tourist = await Tourist.findOne({ _id: user });

        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }

        // Find the booking by ID and user
        const booking = await Bookings.findOne({ _id: bookingId, user });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found or does not belong to the user' });
        }

        const timeDifference = (new Date(booking.date) - currentDate) / (1000 * 60 * 60); // Convert milliseconds to hours

        if (timeDifference <= 48) {
            return res.status(400).json({ message: 'Cannot cancel within 48 hours of the activity/itinerary' });
        }

        // Convert itemId to ObjectId for comparison
        const itemObjectId = new mongoose.Types.ObjectId(itemId);

        // Handle cancellation of activity or itinerary
        let updatedBooking;
        if (type === 'activity') {
            // Check if the activity exists in the booking by checking each activity's _id
            const activityExists = booking.activities.some(activity => activity._id.equals(itemObjectId));

            if (!activityExists) {
                return res.status(404).json({ message: 'Activity not found in the booking' });
            }

            // Remove the activity from the booking
            updatedBooking = await Bookings.findOneAndUpdate(
                { _id: bookingId, user },
                { $pull: { activities: { _id: itemObjectId } } },
                { new: true }
            );

        } else if (type === 'itinerary') {
            // Check if the itinerary exists in the booking by checking each itinerary's _id
            const itineraryExists = booking.itineraries.some(itinerary => itinerary._id.equals(itemObjectId));

            if (!itineraryExists) {
                return res.status(404).json({ message: 'Itinerary not found in the booking' });
            }

            // Remove the itinerary from the booking
            updatedBooking = await Bookings.findOneAndUpdate(
                { _id: bookingId, user },
                { $pull: { itineraries: { _id: itemObjectId } } },
                { new: true }
            );

        } else {
            return res.status(400).json({ message: 'Invalid type for cancellation. Must be "activity" or "itinerary".' });
        }

        // After updating, check if the booking has any activities or itineraries left
        if (updatedBooking.activities.length === 0 && updatedBooking.itineraries.length === 0) {
            // If no activities or itineraries are left, delete the entire booking
            await Bookings.deleteOne({ _id: bookingId });
            return res.status(200).json({ message: 'Booking successfully canceled and deleted', updatedBooking });
        }

        res.status(200).json({ message: 'Booking successfully canceled', updatedBooking });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



const receiveLoyaltyPoints = async (req, res) => {
    const { name, userName } = req.params;
    try {
        const activityDetails = await Activity.findOne({ name });
        console.log(name)
        if (!activityDetails) {
            return res.status(404).json({ success: false, message: 'Activity not found' });
        }
        const activityPrice = activityDetails.price;
        const tourist = await Tourist.findOne({ userName });
        if (!tourist) {
            return res.status(404).json({ success: false, message: 'Tourist not found' });
        }

        let loyaltyPoints = 0;
        switch (tourist.level) {
            case 1:
                loyaltyPoints = activityPrice * 0.5;
                break;
            case 2:
                loyaltyPoints = activityPrice * 1;
                break;
            case 3:
                loyaltyPoints = activityPrice * 1.5;
                break;
            default:
                loyaltyPoints = 0;
        }
        
        tourist.points += loyaltyPoints;

        await tourist.save();
        await updateLevel(tourist.userName, tourist.points);

        res.status(200).json({ success: true, points: tourist.points });
    } catch (error) {
        res.status(500).json({ success: false, message: 'An error occurred', error });
    }
};

const updateLevel = async (userName, points) => {
    try {
        const user = await Tourist.findOne({ userName });
        console.log(userName, points)
        if (!user) {
            console.error('User not found');
            return;
        }

        if (points >= 10000 && points < 50000) {
            user.level = 2;
        } else if (points >= 50000) {
            user.level = 3;
        }
        
        await user.save();

    } catch (error) {
        console.error('Error updating level:', error);
    }
};

const redeemPoints = async (req,res) =>{
    try{
        const {userName} = req.params;
        const addPoints = Number(req.query.addPoints);
        const tourist = await Tourist.findOne({ userName });
        let myPoints = tourist.points;
        let myWallet = tourist.wallet;
        if (myPoints > addPoints){
            myPoints -= addPoints;
            myWallet = addPoints / 100;
            tourist.points = myPoints;
            tourist.wallet = myWallet;
            await tourist.save();
            res.status(200).json({
                message: "Points redeemed successfully",
                points: myPoints,
                wallet: myWallet
            });
        } else {
            res.status(400).json({ message: "Not enough points to redeem" });
        }

    } catch {
        res.status(500).json({ message: "An error occurred", error });
    }
};


module.exports = {
    receiveLoyaltyPoints, updateLevel, redeemPoints, createBooking, getMyBookings, cancelMyBooking, viewMyUpcomingBookings, viewMyPastBookings, viewDesiredActivity, viewDesiredItinerary
}
