const mongoose = require('mongoose');
const Tourist = require("../Models/touristModel.js");
const Activity = require("../Models/activityModel.js");
const Itinerary = require("../Models/itineraryModel.js");
const ActivityBooking = require('../Models/activityBookingModel.js');
const ItineraryBooking = require('../Models/itineraryBookingModel');
const ThirdPartyBookings = require('../Models/ThirdPartyBookingsModel.js');


const createBooking = async (req, res) => {
    const { user } = req.params;
    const { activityId, itineraryId ,hotel, transportation, flight , type, date } = req.body;
    console.log("requestBody", req.body);

    try {
        const tourist = await Tourist.findOne({ userName: user });
        if (!tourist) {
            res.status(404).json({ message: "Tourist not found" });
            return;
        }

        const convertedDate = new Date(date);

        const activity = activityId ? await Activity.findById(activityId) : null;
        const itinerary = itineraryId ? await Itinerary.findById(itineraryId) : null;

        console.log(activityId, itineraryId, type);

        if (activityId && type === 'activity') {
            activity.bookedCount += 1;
            await activity.save();
            const newActivityBooking = await ActivityBooking.create({
                user: tourist.userName,
                activity: activityId,  // Make sure you refer to activity here
                chosenDate: activity.date,
                chosenPrice: activity.price
            });
            await newActivityBooking.save();
            return res.status(200).json({
                message: "Activity booking updated successfully",
                booking: newActivityBooking,
                status: 200,
                log: 'Activity booking created',
                bookingCount: activity.bookedCount,
                price: activity.price,
                wallet: tourist.wallet,
                points: tourist.points
            });
        }

        if (itineraryId && type === 'itinerary') {
            itinerary.bookedCount += 1;
            await itinerary.save();
            const newItineraryBooking = await ItineraryBooking.create({
                user: tourist.userName,
                itinerary: itinerary._id,
                chosenDate: convertedDate,
                chosenPrice: itinerary.price
            });
            await newItineraryBooking.save();
            return res.status(200).json({
                message: "Itinerary booking updated successfully",
                booking: newItineraryBooking,
                status: 200,
                log: 'Itinerary booking created',
                bookingCount: itinerary.bookedCount,
                price: itinerary.price,
                wallet: tourist.wallet,
                points: tourist.points
            });
        }
        else if(type === 'hotel' && hotel){
            const newHotelBooking = await ThirdPartyBookings.create({
                user: tourist.userName,
                hotels: hotel
            });
            await newHotelBooking.save();
            return res.status(200).json({
                message: "Hotel booking created successfully",
                booking: newHotelBooking,
                status: 200,
                wallet: tourist.wallet,
                points: tourist.points
            });
        }
        else if(type === 'transportation' && transportation){
            const newtransportationBooking = await ThirdPartyBookings.create({
                user: tourist.userName,
                transportations: transportation
            });
            await newtransportationBooking.save();
            return res.status(200).json({
                message: "transportation booking created successfully",
                booking: newtransportationBooking,
                status: 200,
                wallet: tourist.wallet,
                points: tourist.points
            });
        }
        else if(type === 'flight' && flight){
            const newFlightBooking = await ThirdPartyBookings.create({
                user: tourist.userName,
                flights: flight
            });
            await newFlightBooking.save();
            return res.status(200).json({
                message: "Flight booking created successfully",
                booking: newFlightBooking,
                status: 200,
                wallet: tourist.wallet,
                points: tourist.points
            });
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

        const upcomingActivityBookings = await ActivityBooking.find({
            user: tourist,
            chosenDate: { $gte: new Date() }
        }).populate('activity'); // Populate if you need activity details

        const upcomingItineraryBookings = await ItineraryBooking.find({
            user: tourist,
            chosenDate: { $gte: new Date() }
        }).populate('itinerary'); // Populate if you need itinerary details

        if (!upcomingActivityBookings.length && !upcomingItineraryBookings.length) {
            return res.status(404).json({ message: "No upcoming bookings found." });
        }

        res.status(200).json({
            activities: upcomingActivityBookings,
            itineraries: upcomingItineraryBookings
        });
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

        // Log the current date for debugging
        console.log("Current Date:", new Date());

        // Fetch past activity bookings and itinerary bookings
        const [pastActivityBookings, pastItineraryBookings] = await Promise.all([
            ActivityBooking.find({
                user: tourist,
                chosenDate: { $lt: new Date() }
            }).populate('activity'),
            ItineraryBooking.find({
                user: tourist,
                chosenDate: { $lt: new Date() }
            }).populate('itinerary')
        ]);

        // Log results for debugging
        console.log("Past Activity Bookings:", pastActivityBookings);
        console.log("Past Itinerary Bookings:", pastItineraryBookings);

        // Check if there are no past bookings
        if (!pastActivityBookings.length && !pastItineraryBookings.length) {
            return res.status(404).json({ message: "No past bookings found." });
        }

        res.status(200).json({
            activities: pastActivityBookings,
            itineraries: pastItineraryBookings
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const viewDesiredActivity = async (req, res) => {
    try {
        const { activityId } = req.params;
        const result = await Activity.findOne({ _id: activityId });
        if (!result) {
            return res.status(404).json({ message: "Activity not found" });
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const viewDesiredItinerary = async (req, res) => {
    try {
        //console.log(req.params);
        const { itineraryId } = req.params;
        const result = await Itinerary.findOne({ _id: itineraryId });
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
        const { tourist } = req.query;

        if (!tourist) {
            return res.status(400).json({ message: "Tourist query parameter is required." });
        }

        // Fetch activity bookings for the tourist
        const activityBookings = await ActivityBooking.find({
            user: tourist
        }).populate('activity');

        // Fetch itinerary bookings for the tourist
        const itineraryBookings = await ItineraryBooking.find({
            user: tourist
        }).populate('itinerary');

        //fetch third party bookings
        const thirdPartyBookings = await ThirdPartyBookings.find({user: tourist});

        // Check if there are no bookings
        if (!activityBookings.length && !itineraryBookings.length && !thirdPartyBookings.length) {
            return res.status(404).json({ message: "No bookings found." });
        }
        console.log("ThirdPartyBookings",thirdPartyBookings);

        // Extract flights, hotels, and transportations from third party bookings
        // const flights = thirdPartyBookings
        // .filter(booking => booking.flights)
        // .map(booking => booking.flights);
       
        const flights = thirdPartyBookings
        .filter(booking => booking.flights)
        .map(booking => ({
            id: booking._id,
            flights: booking.flights
        }));

        const hotels = thirdPartyBookings
        .filter(booking => booking.hotels)
        .map(booking => ({
            id: booking._id,
            hotels: booking.hotels
        }));

        const transportations = thirdPartyBookings
        .filter(booking => booking.transportations)
        .map(booking => ({
            id: booking._id,
            transportations: booking.transportations
        }))

        // Return bookings as a response
        res.status(200).json({
            activities: activityBookings,
            itineraries: itineraryBookings,
            flights: flights,
            hotels: hotels,
            transportations: transportations
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const cancelMyBooking = async (req, res) => {
    const { user } = req.params;
    const { type, itemId, price , booking } = req.body;
    // const { booking } = req.body.booking || "";
    const currentDate = new Date();
    console.log("requestBody", req.body);
    let itemObjectId;

    try {
        const tourist = await Tourist.findOne({ userName: user });
        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }
        if(itemId){
         itemObjectId = new mongoose.Types.ObjectId(itemId);
        }
        else if(booking){
        itemObjectId = new mongoose.Types.ObjectId(booking);
        }
        let itemDate;

        if (type === 'activity') {
            const activityBooking = await ActivityBooking.findOne({ user, activity: itemObjectId });

            if (!activityBooking) {
                return res.status(404).json({ message: 'Activity not found in the booking' });
            }

            itemDate = activityBooking.chosenDate;

            const timeDifference = (new Date(itemDate) - currentDate) / (1000 * 60 * 60);
            if (timeDifference <= 48) {
                return res.status(400).json({ message: 'Cannot cancel within 48 hours of the activity' });
            }

            tourist.wallet += parseFloat(price);
            await tourist.save();

            await Activity.updateOne(
                { _id: itemObjectId },
                { $inc: { bookedCount: -1 } }
            );

            await ActivityBooking.deleteOne({ user, activity: itemObjectId });

        } else if (type === 'itinerary') {
            const itineraryBooking = await ItineraryBooking.findOne({ user, itinerary: itemObjectId });

            if (!itineraryBooking) {
                return res.status(404).json({ message: 'Itinerary not found in the booking' });
            }

            itemDate = itineraryBooking.chosenDate;

            const timeDifference = (new Date(itemDate) - currentDate) / (1000 * 60 * 60);
            if (timeDifference <= 48) {
                return res.status(400).json({ message: 'Cannot cancel within 48 hours of the itinerary' });
            }

            tourist.wallet += parseFloat(price);
            await tourist.save();

            await Itinerary.updateOne(
                { _id: itemObjectId },
                { $inc: { bookedCount: -1 } }
            );

            await ItineraryBooking.deleteOne({ user, itinerary: itemObjectId });

        } else if (type === 'flight' || type === 'hotel' || type === 'transportation') {
            const thirdPartyBooking = await ThirdPartyBookings.findOne({ user });
            if (!thirdPartyBooking) {
                return res.status(404).json({ message: 'Booking not found in the ThirdPartyBookings' });
            }
            console.log("Booking itemObjectId",booking);

            await ThirdPartyBookings.findByIdAndDelete(booking);
            
            tourist.wallet += parseFloat(price);
            await tourist.save();
        } 
        else {
            return res.status(400).json({ message: 'Invalid type for cancellation. Must be "activity" or "itinerary".' });
        }

        return res.status(200).json({ message: 'Booking item successfully canceled' });

    } catch (error) {
        return res.status(500).json({ message: error.message });
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


const getLevel = async (req, res) => {
    const { userName } = req.params;
    try {
        const user = await Tourist.findOne({ userName });
        const level = user.level || 1;
        if (!user) {
            console.error('User not found');
         res.status(404).json({ message: "User not found" });
        }
        else{
         res.status(200).json(level);
        }
    } catch (error) {
       return  res.status(500).json({ message: error.message });
    }
}
const updateLevel = async (userName, points) => {
    try {
        const user = await Tourist.findOne({ userName });
        console.log(userName, points)
        if (!user) {
            console.error('User not found');
            return;
        }

        if (points >= 100000 && points < 500000) {
            user.level = 2;
        } else if (points >= 500000) {
            user.level = 3;
        } else {
            user.level = 1;
        }

        await user.save();
        await tourist.save();

    } catch (error) {
        console.error('Error updating level:', error);
    }
};

const redeemPoints = async (req, res) => {
    try {
        const { userName } = req.params;
        const addPoints = Number(req.query.addPoints);
        const tourist = await Tourist.findOne({ userName });
        let myPoints = tourist.points;
        let myWallet = tourist.wallet;
        if (myPoints > addPoints) {
            myPoints -= addPoints;
            myWallet = myWallet + 100;
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
        updateLevel(tourist.userName, myPoints);

    } catch {
        res.status(500).json({ message: "An error occurred", error });
    }
};

const payVisa = async (req, res) => {
    try {
        const { userName } = req.params;
        const { price } = req.body;
        const tourist = await Tourist.findOne({ userName });
        if (tourist.level === 1) {
            tourist.points += (price * 0.5)
        }
        else if (tourist.level === 2) {
            tourist.points += (price * 1.0)
        }
        else if (tourist.level === 3) {
            tourist.points += (price * 1.5)
        }
        if (tourist.points >= 10000 && tourist.points < 50000) {
            tourist.level = 2;
        } else if (tourist.points >= 50000) {
            tourist.level = 3;
        } else {
            tourist.level = 1;
        }
        await tourist.save();
        await tourist.save();
        res.status(200).json({
            status: 200,
            message: "Points updated successfully",
            wallet: tourist.wallet,
            points: tourist.points
        });
    } catch {
        res.status(500).json({ message: "An error occurred", error });
    }
};

const payWallet = async (req, res) => {
    try {
        const { userName } = req.params;
        const { price } = req.body;
        const tourist = await Tourist.findOne({ userName });
        const level = tourist.level;
        console.log(tourist);
        console.log("body",req.body);
        console.log("wallet",tourist.wallet);
        console.log("price",price);
        let myWallet = tourist.wallet;
        if (myWallet >= price) {
            myWallet -= price;
            tourist.wallet = myWallet;
            await tourist.save();
            if (tourist.level === 1) {
                tourist.points += (price * 0.5)
            }
            else if (tourist.level === 2) {
                tourist.points += (price * 1.0)
            }
            else if (tourist.level === 3) {
                tourist.points += (price * 1.5)
            }
            if (tourist.points >= 10000 && tourist.points < 50000) {
                tourist.level = 2;
            } else if (tourist.points >= 50000) {
                tourist.level = 3;
            } else {
                tourist.level = 1;
            }
            await tourist.save();
            res.status(200).json({
                status: 200,
                message: "Activity/Itinerary payed successfully",
                wallet: myWallet,
                points: tourist.points
            });
        } else {
            res.status(400).json({ message: "Not enough money in the wallet" });
        }
    } catch (error) {
        return res.status(500).json({ message: "An error occurred", error });
    }
};


module.exports = {
    receiveLoyaltyPoints, updateLevel, redeemPoints, createBooking, getMyBookings, cancelMyBooking, viewMyUpcomingBookings, viewMyPastBookings, viewDesiredActivity, viewDesiredItinerary, getLevel, payWallet, payVisa
}
