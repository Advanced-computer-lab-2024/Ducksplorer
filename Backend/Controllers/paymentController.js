const Tourist = require("../Models/touristModel.js");
const Activity = require("../Models/activityModel.js");

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
    receiveLoyaltyPoints, updateLevel, redeemPoints
}
