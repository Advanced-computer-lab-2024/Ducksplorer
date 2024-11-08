const Tourist = require("../Models/touristModel.js");
const TourGuide = require("../Models/tourGuideModel.js");
const Seller = require("../Models/sellerModel.js");
const Advertiser = require("../Models/advertiserModel");
const User = require("../Models/userModel.js");
const path = require('path');
const signUp = async (req, res) => { //req gai mn el frontend el etmalet wa2t el signup
    try {
        const { email, userName, password, nationalId } = req.body;
        const user = await User.findOne({ userName });

        if (user) {
            return res.status(400).json({ error: "Username Already Exists" });
        }
        const role = req.body.role;
        let status = "Approved";
        if (role === "Guide" || role === "Seller" || role === "Advertiser") {
            status = "Pending";
        }

        if (role === "Tourist") {
            const mobileNumber = req.body.mobileNumber;
            const nationality = req.body.nationality;
            const DOB = req.body.DOB;
            const employmentStatus = req.body.employmentStatus;
            const newTourist = new Tourist({ email, userName, password, mobileNumber, nationality, DOB, employmentStatus });
            await newTourist.save();
            res.status(201).json(newTourist);
        }
        if (role === "Guide") {
            const mobileNumber = req.body.mobileNumber;
            const yearsOfExperience = req.body.yearsOfExperience;
            const previousWork = req.body.previousWork;
            const newTourGuide = new TourGuide({ email, userName, password, mobileNumber, yearsOfExperience, previousWork });
            await newTourGuide.save();
            res.status(201).json(newTourGuide);
        }
        if (role === "Seller") {
            const description = req.body.description;
            const name = req.body.name;
            const taxationRegisteryCard = req.body.taxationRegisteryCard;
            //const filepath = path.join(__dirname, 'getpending', req.params.filename);
            const newSeller = new Seller({ email, userName, password, nationalId, name, description, taxationRegisteryCard });
            await newSeller.save();
            res.status(201).json(newSeller);
        }
        if (role === "Advertiser") {
            const websiteLink = req.body.websiteLink;
            const hotline = req.body.hotline;
            const companyProfile = req.body.companyProfile;
            const taxationRegisteryCard = req.body.taxationRegisteryCard;
            //const filepath = path.join(__dirname, 'getpending', req.params.filename);
            const newAdvertiser = new Advertiser({ email, userName, password, nationalId, websiteLink, hotline, companyProfile, taxationRegisteryCard });
            await newAdvertiser.save();
            res.status(201).json(newAdvertiser);
        }
        const newuser = new User({ role, userName, password, status });
        await newuser.save();

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const login = async (req, res) => {
    try {
        const { userName, password } = req.body;
        const user = await User.findOne({ userName });
        let tourist;

        if (user) {
            if (user.status === "Pending") {
                return res.status(400).json({ error: "Your Account is not approved yet" });
            }
            if (!user || (user.password !== password)) {
                return res.status(400).json({ error: "Incorrect UserName or Password" });
            }
            if (user.role == "Tourist") {
                tourist = await Tourist.findOne({ userName });
            }



            res.status(200).json({
                _id: user._id,
                username: user.userName,
                role: user.role,
                email: user.role === "Tourist" ? tourist.email : " "
            })
        }
        else {
            return res.status(400).json({ error: "Account does not exist" });
        }

    } catch (error) {
        console.log("Error in Login Controller", error.message)
        res.status(500).json({ error: "Error" })
    }

}




module.exports = { signUp, login };