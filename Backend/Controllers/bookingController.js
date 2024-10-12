const Tourist = require("../Models/touristModel.js");
const Activity = require("../Models/activityModel.js");
const Bookings = require("../Models/bookingsModel.js");

const createBooking = async (req, res) => {
    const { user } = req.params;
    const { date, price, type } = req.body;

    try {
        const tourist = await Tourist.findOne({userName:user});
        console.log(user);

        if (!tourist) {
            return res.status(404).json({ message: "Tourist not found" });
        }

        const newBooking = new Bookings({
            user: tourist.userName, // Reference the userName from the Tourist model
            date,
            price,
            type
        });
        await newBooking.save();

        res.status(201).json(newBooking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


const getMyBookings = async (req, res) => {
    try {
        const { user } = req.params;

        // Find bookings by user and project only 'date' and 'type'
        const bookings = await Bookings.find({ user }, 'date price type');

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const cancelMyBooking = async (req, res) => {
    const { user } = req.params; // User from the URL parameters
    const currentDate = new Date();
    const { bookingId } = req.body; // Take bookingId from the body
    const tourist = await Tourist.findOne({userName: user});
    let myWallet = tourist.wallet;

    try {
        const booking = await Bookings.findOne({ _id: bookingId, user });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found or does not belong to the user' });
        }

        const timeDifference = (new Date(booking.date) - currentDate) / (1000 * 60 * 60); // Convert milliseconds to hours

        if (timeDifference <= 48) {
            return res.status(400).json({ message: 'Cannot cancel within 48 hours of the activity/itinerary' });
        }
            myWallet += booking.price;
            tourist.wallet = myWallet;
            console.log(booking.price,tourist.wallet);
            await tourist.save();
            await Bookings.deleteOne({ _id: bookingId });
        res.status(200).json({ message: 'Booking successfully canceled' });
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
    receiveLoyaltyPoints, updateLevel, redeemPoints, createBooking, getMyBookings, cancelMyBooking
}
