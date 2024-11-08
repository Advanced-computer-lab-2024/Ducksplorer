const mongoose = require('mongoose');
const Tourist = require("../Models/touristModel.js");
const Activity = require("../Models/activityModel.js");
const Bookings = require("../Models/bookingsModel.js");
const Itinerary = require("../Models/itineraryModel.js");

const createBooking = async (req, res) => {
    const { user } = req.params;  // URL parameter for user
    const { activityId, itineraryId, type } = req.body;

    try {
        const tourist = await Tourist.findOne({ userName: user });
        if (!tourist) {
            res.status(404).json({ message: "Tourist not found" });
            return;
        }

        const activity = activityId ? await Activity.findById(activityId) : null;
        const itinerary = itineraryId ? await Itinerary.findById(itineraryId) : null;

        console.log(activityId, itineraryId, type);

        // Look for an existing booking
        let booking = await Bookings.findOne({ user });

        if (booking) {
            // Handle adding activity if it doesn't already exist in the booking
            if (activityId && type === 'activity') {
                const activityExists = booking.activities.some(a => a._id.toString() === activityId);
                if (!activityExists) {
                    booking.activities.push(activity);
                    activity.bookedCount += 1;
                    await activity.save();  // Save the updated activity
                    res.status(200).json({
                        message: "Booking updated successfully", booking,
                        status: 200,
                        log: 'Activity booking created',
                        bookingCount: activity.bookedCount,
                        price: activity.price,
                        wallet: tourist.wallet
                    })
                } else {
                    res.status(400).json({ message: "Activity already exists in the booking" });
                }
            }

            // Handle adding itinerary if it doesn't already exist in the booking
            if (itineraryId && type === 'itinerary') {
                const itineraryExists = booking.itineraries.some(i => i._id.toString() === itineraryId);
                if (!itineraryExists) {
                    booking.itineraries.push(itinerary);
                    itinerary.bookedCount += 1;
                    await itinerary.save();  // Save the updated itinerary
                    res.status(200).json({
                        message: "Booking updated successfully", booking,
                        status: 200,
                        log: 'Itinerary booking created',
                        bookingCount: itinerary.bookedCount,
                        price: itinerary.price,
                        wallet: tourist.wallet
                    })
                } else {
                    res.status(400).json({ message: "Itinerary already exists in the booking" });
                }
            }

            // Save the updated booking
            await booking.save();
            //res.status(200).json({ message: "Booking updated successfully", booking });
        } else {
            // If no booking exists, create a new one
            const newBooking = new Bookings({
                user,
                activities: activityId ? [activity] : [], // Start with an array
                itineraries: itineraryId ? [itinerary] : []
            });
            // Update bookedCount for new activity and itinerary even when it is the 1st booking for the tourist
            if (activity) {
                activity.bookedCount += 1;
                await activity.save();  // Save the updated activity count
            }
            if (itinerary) {
                itinerary.bookedCount += 1;
                await itinerary.save();  // Save the updated itinerary count
            }

            // Save the new booking
            await newBooking.save();
            res.status(201).json(newBooking);
        }

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


// const createBooking = async (req, res) => {
//     const { user } = req.params;  // URL parameter for user
//     const { activityId, itineraryId, type } = req.body;

//     if (!activityId && !itineraryId) {
//         return res.status(400).json({ message: "At least one of activityId or itineraryId must be provided" });
//     }

//     try {
//         const tourist = await Tourist.findOne({ userName: user });
//         if (!tourist) {
//             return res.status(404).json({ message: "Tourist not found" });
//         }

//         const activity = activityId ? await Activity.findById(activityId) : null;
//         const itinerary = itineraryId ? await Itinerary.findById(itineraryId) : null;

//         console.log(activityId, itineraryId);

//         // Look for an existing booking
//         let booking = await Bookings.findOne({ user });

//         if (booking) {
//             // Handle adding activity if it doesn't already exist in the booking
//             if (activityId && type === 'activity') {
//                 const activityExists = booking.activities.some(a => a._id.toString() === activityId);
//                 if (!activityExists) {
//                     booking.activities.push(activity);
//                     activity.bookedCount += 1;
//                     await activity.save();  // Save the updated activity
//                     res.status(200).json({
//                         message: "Activity booking created",
//                         type: type,
//                         points: activity.points,
//                         bookingCount: activity.bookedCount,
//                         name: activity.name,
//                         price: activity.price,
//                         wallet: user.wallet
//                     });
//                 } else {
//                     return res.status(400).json({
//                         message: "Activity already exists in the booking",
//                     });
//                 }
//             }
//             // Handle adding itinerary if it doesn't already exist in the booking
//             if (itineraryId && type === 'itinerary') {
//                 const itineraryExists = booking.itineraries.some(i => i._id.toString() === itineraryId);
//                 if (!itineraryExists) {
//                     booking.itineraries.push(itinerary);
//                     itinerary.bookedCount += 1;
//                     await itinerary.save();  // Save the updated itinerary
//                     res.status(200).json({
//                         message: "Itinerary booking created",
//                         type: type,
//                         points: activity.points,
//                         bookingCount: activity.bookedCount,
//                         name: activity.name,
//                         price: activity.price,
//                         wallet: user.wallet
//                     });
//                 } else {
//                     return res.status(400).json({ message: "Itinerary already exists in the booking" });
//                 }
//             }

//             // Save the updated booking
//             await booking.save();
//             return res.status(200).json({ message: "Booking updated successfully", booking });
//         } else {
//             // If no booking exists, create a new one
//             const newBooking = new Bookings({
//                 user,
//                 activities: activityId ? [activity] : [], // Start with an array
//                 itineraries: itineraryId ? [itinerary] : []
//             });
//             await newBooking.save();
//             return res.status(201).json(newBooking);
//         }

//     } catch (err) {
//         return res.status(500).json({ message: err.message });

//     }
// };



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
        const { user } = req.params;

        if (!user) {
            return res.status(400).json({ message: "user parameter is required." });
        }

        // Find bookings for the user
        const bookings = await Bookings.find({ user });

        if (!bookings.length) {
            return res.status(404).json({ message: "No bookings found." });
        }

        // Filter each booking's activities and itineraries for past dates
        const pastBookings = bookings.map(booking => {
            const pastActivities = booking.activities.filter(activity => new Date(activity.date) < new Date());

            const pastItineraries = booking.itineraries.filter(itinerary =>
                itinerary.availableDatesAndTimes.some(date => new Date(date) < new Date())
            );

            return {
                ...booking.toObject(), // Spread the booking object properties
                activities: pastActivities, // Replace activities with filtered past activities
                itineraries: pastItineraries // Replace itineraries with filtered past itineraries
            };
        }).filter(booking => booking.activities.length > 0 || booking.itineraries.length > 0); // Only include bookings with past activities or itineraries

        if (!pastBookings.length) {
            return res.status(404).json({ message: "No past activities or itineraries found." });
        }

        res.status(200).json(pastBookings);
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
        const { user } = req.params;

        // Find bookings by user and project only 'date' and 'type'
        const bookings = await Bookings.find({ user });

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const cancelMyBooking = async (req, res) => {
    const { user } = req.params;
    const { type, itemId, price } = req.body;
    const currentDate = new Date();

    try {
        const tourist = await Tourist.findOne({ userName: user });
        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }

        const booking = await Bookings.findOne({ user });
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found or does not belong to the user' });
        }

        const itemObjectId = new mongoose.Types.ObjectId(itemId);
        let itemDate;

        if (type === 'activity') {
            const activity = booking.activities.find(activity => activity._id.equals(itemObjectId));
            if (!activity)
                return res.status(404).json({ message: 'Activity not found in the booking' });
            itemDate = activity.date;

            // Check time difference for activity
            const timeDifference = (new Date(itemDate) - currentDate) / (1000 * 60 * 60);
            if (timeDifference <= 48) {
                return res.status(400).json({ message: 'Cannot cancel within 48 hours of the activity' });
            }
            activity.bookedCount -= 1;
            tourist.wallet += price;
            await tourist.save();
            // Remove the activity from the booking
            await Bookings.updateOne(
                { user },
                { $pull: { activities: { _id: itemObjectId } } }
            );

        } else if (type === 'itinerary') {
            const itinerary = booking.itineraries.find(itinerary => itinerary._id.equals(itemObjectId));
            if (!itinerary) return res.status(404).json({ message: 'Itinerary not found in the booking' });
            itemDate = itinerary.chosenDate;

            // Check time difference for itineraries
            const timeDifference = (new Date(itemDate) - currentDate) / (1000 * 60 * 60);
            if (timeDifference <= 48) {
                return res.status(400).json({ message: 'Cannot cancel within 48 hours of the itinerary' });
            }

            // Update booked count and remove the itinerary from the booking
            itinerary.bookedCount -= 1;
            tourist.wallet += price;
            await tourist.save();

            await Bookings.updateOne(
                { user },
                { $pull: { itineraries: { _id: itemObjectId } } }
            );

        } else {
            return res.status(400).json({ message: 'Invalid type for cancellation. Must be "activity" or "itinerary".' });
        }

        // Check if booking is empty and delete if no items remain
        const updatedBooking = await Bookings.findOne({ user });
        if (updatedBooking.activities.length === 0 && updatedBooking.itineraries.length === 0) {
            await Bookings.deleteOne({ user });
            return res.status(200).json({ message: 'Booking successfully canceled and deleted' });
        }

        return res.status(200).json({ message: 'Booking item successfully canceled', updatedBooking });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};



// const receiveLoyaltyPoints = async (req, res) => {
//     const { name, userName } = req.params;
//     try {
//         const activityDetails = await Activity.findOne({ name });
//         console.log(name)
//         if (!activityDetails) {
//             return res.status(404).json({ success: false, message: 'Activity not found' });
//         }
//         const activityPrice = activityDetails.price;
//         const tourist = await Tourist.findOne({ userName });
//         if (!tourist) {
//             return res.status(404).json({ success: false, message: 'Tourist not found' });
//         }

//         let loyaltyPoints = 0;
//         switch (tourist.level) {
//             case 1:
//                 loyaltyPoints = activityPrice * 0.5;
//                 break;
//             case 2:
//                 loyaltyPoints = activityPrice * 1;
//                 break;
//             case 3:
//                 loyaltyPoints = activityPrice * 1.5;
//                 break;
//             default:
//                 loyaltyPoints = 0;
//         }

//         tourist.points += loyaltyPoints;

//         await tourist.save();
//         await updateLevel(tourist.userName, tourist.points);

//         res.status(200).json({ success: true, points: tourist.points });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'An error occurred', error });
//     }
// };


const receiveLoyaltyPoints = async (price, userName) => {
    console.log("inside receiveLoyaltyPoints");
    //let { price, userName } = req.params;

    console.log('Received price:', price);  // Debugging line to inspect the value of price

    // Validate that price is a valid number
    price = price.trim();  // Trim any whitespace
    const priceNumber = parseFloat(price);

    if (isNaN(priceNumber) || priceNumber <= 0) {
        console.log("inValid price")
        //return res.status(400).json({ success: false, message: 'Invalid price value' });
    }

    try {
        const tourist = await Tourist.findOne({ userName });
        if (!tourist) {
            console.log("Tourist not found")
            //return res.status(404).json({ success: false, message: 'Tourist not found' });
        }
        console.log("")
        let loyaltyPoints = 0;
        switch (tourist.level) {
            case 1:
                loyaltyPoints = priceNumber * 0.5;
                break;
            case 2:
                loyaltyPoints = priceNumber * 1;
                break;
            case 3:
                loyaltyPoints = priceNumber * 1.5;
                break;
            default:
                loyaltyPoints = 0;
        }

        tourist.points += loyaltyPoints;

        console.log("Before Tourist.save working inside the receiveLoyaltyPoints")
        // await tourist.save();
        console.log("Tourist.save working inside the receiveLoyaltyPoints");
        await updateLevel(tourist.userName, tourist.points);
        console.log("updateLevel working inside the receiveLoyaltyPoints");

        console.log("Tourist Added Successfully")
        //res.status(200).json({ success: true, points: tourist.points });
    } catch (error) {
        //res.status(500).json({ success: false, message: 'An error occurred', error });
    }
};


const getLevel = async (req, res) => {
    const { userName } = req.params;
    try {
        const user = await Tourist.findOne({ userName });
        if (!user) {
            console.error('User not found');
            return;
        }
        res.status(200).json(user.level);
    } catch (error) {
        res.status(500).json({ message: error.message });
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

        if (points >= 10000 && points < 50000) {
            user.level = 2;
        } else if (points >= 50000) {
            user.level = 3;
        } else {
            user.level = 1;
        }

        await user.save();

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
            myWallet += addPoints / 100;
            //myWallet = myWallet + 100;
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

        await receiveLoyaltyPoints(price, userName);
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
        let myWallet = tourist.wallet;
        if (myWallet >= price) {
            console.log("inside");
            myWallet -= price;
            tourist.wallet = myWallet;
            await tourist.save();
            console.log("Tourist.save working")
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
            console.log("Tourist.recieveLoyaltyPoints working")
            await tourist.save();
            console.log("Tourist.save 2 is working")
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
