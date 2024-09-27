<<<<<<< HEAD
const Tourist = require("../Models/touristModel");
const TourGuide = require("../Models/tourGuideModel");
const Seller = require("../Models/sellerModel");
const Advertiser = require("../Models/advertiserModel");

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
=======
const signUp = (req,res) => { //req gai mn el frontend el etmalet wa2t el signup
    const {email,userName,password} = req.body;
    if(req.body.type.equals("Tourist")){
        const mobileNumber = req.body.mobileNumber;
        const nationality = req.body.nationality;
        const DOB = req.body.DOB;
        const employmentStatus = req.body.employmentStatus;
>>>>>>> 61a8f9f830edb4113c92ce6392492fa815d2e1a1
    }
    if(req.body.type.equals("TourGuide")){
        const mobileNumber = req.body.mobileNumber;
        const yearsOfExperience = req.body.yearsOfExperience;
        const previousWork = req.body.previousWork;
    }
    if(req.body.type.equals("Seller")){
        const description = req.body.description;
        const name = req.body.name;
    }
    if(req.body.type.equals("Advertiser")){
        const websiteLink = req.body.websiteLink;
        const hotline = req.body.hotline;
        const companyProfile = req.body.companyProfile;
    }

    
    
}