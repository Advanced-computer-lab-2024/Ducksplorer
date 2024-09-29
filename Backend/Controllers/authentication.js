const Tourist = require("../Models/touristModel.js");
const TourGuide = require("../Models/tourGuideModel.js");
const Seller = require("../Models/sellerModel.js");
const Advertiser = require("../Models/advertiserModel");
const User = require("../Models/userModel.js");

const signUp = async (req,res) => { //req gai mn el frontend el etmalet wa2t el signup
    try{
        const {email,userName,password} = req.body;
        const user = await User.findOne({userName});
        if(user){
            return res.status(400).json({error:"Username Already Exists"});
        }
        const role = req.body.role;
        const newuser = new User({role , userName, password , status:"Pending"});
        await newuser.save();

        if(role === "Tourist" ){
            const mobileNumber = req.body.mobileNumber;
            const nationality = req.body.nationality;
            const DOB = req.body.DOB;
            const employmentStatus = req.body.employmentStatus;
            const newTourist = new Tourist({email, userName, password, mobileNumber, nationality, DOB, employmentStatus});
            await newTourist.save();
            res.status(201).json(newTourist);
        }
        if(role === "TourGuide"){
            const mobileNumber = req.body.mobileNumber;
            const yearsOfExperience = req.body.yearsOfExperience;
            const previousWork = req.body.previousWork;
            const newTourGuide = new TourGuide({ email, userName, password, mobileNumber, yearsOfExperience, previousWork});
            await newTourGuide.save();
            res.status(201).json(newTourGuide);
        }
        if(role === "Seller"){
            const description = req.body.description;
            const name = req.body.name;
            const newSeller = new Seller({email, userName, password, description, name});
            await newSeller.save();
            res.status(201).json(newSeller);
        }
        if(role === "Advertiser"){
            const websiteLink = req.body.websiteLink;
            const hotline = req.body.hotline;
            const companyProfile = req.body.companyProfile;
            const newAdvertiser = new Advertiser({email, userName, password, websiteLink, hotline, companyProfile});
            await newAdvertiser.save();
            res.status(201).json(newAdvertiser);
        }
    }   catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const login = async (req,res) => {
    try{
        const {username, password} = req.body;
        const user = await User.findOne({username});


        if(!user || (user.password !== password)){
            return res.status(400).json({error: "Incorrect UserName or Password"});
        }

        

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic
        })

    }catch(error){
        console.log("Error in Login Controller", error.message)
        res.status(500).json({error:"Internal Server Error"})
    }
}

module.exports = {signUp, login};