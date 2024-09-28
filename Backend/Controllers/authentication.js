const Tourist = require("../Models/touristModel.js");
const TourGuide = require("../Models/tourGuideModel.js");
const Seller = require("../Models/sellerModel.js");
const Advertiser = require("../Models/advertiserModel.js");

const signUp = async (req,res) => { //req gai mn el frontend el etmalet wa2t el signup
    try{
        const {email,userName,password} = req.body;
        if(req.body.type === "Tourist" ){
            const mobileNumber = req.body.mobileNumber;
            const nationality = req.body.nationality;
            const DOB = req.body.DOB;
            const employmentStatus = req.body.employmentStatus;
            const newTourist = new Tourist({email, userName, password, mobileNumber, nationality, DOB, employmentStatus});
            await newTourist.save();
            res.status(201).json(newTourist);
        }
        if(req.body.type === "TourGuide"){
            const mobileNumber = req.body.mobileNumber;
            const yearsOfExperience = req.body.yearsOfExperience;
            const previousWork = req.body.previousWork;
            const newTourGuide = new TourGuide({ email, userName, password, mobileNumber, yearsOfExperience, previousWork});
            await newTourGuide.save();
            res.status(201).json(newTourGuide);
        }
        if(req.body.type === "Seller"){
            const description = req.body.description;
            const name = req.body.name;
            const newSeller = new Seller({email, userName, password, description, name});
            await newSeller.save();
            res.status(201).json(newSeller);
        }
        if(req.body.type === "Advertiser"){
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
        const {userName,password} = req.body;
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {signUp, login};