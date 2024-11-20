const Tourist = require("../Models/touristModel.js");
const TourGuide = require("../Models/tourGuideModel.js");
const Seller = require("../Models/sellerModel.js");
const Advertiser = require("../Models/advertiserModel");
const User = require("../Models/userModel.js");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const generateToken = (userName, res) => {
    const token = jwt.sign({userName}, process.env.JWT_SECRET,{
        expiresIn: '15d'
    })
    
    res.cookie("jwt", token, {
        maxAge: 15 *24*60*60*1000,
        httpOnly: true, //prevent XSS attacks
        sameSite:"strict", // CSRF attack
        secure: process.env.CURR_ENV === "Develpoment"? false : true
    })
}

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
        // PASSWORD HASH
        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(password, salt);
        const hashedPassword = password;

        if (role === "Tourist") {
            const mobileNumber = req.body.mobileNumber;
            const nationality = req.body.nationality;
            const DOB = req.body.DOB;
            const employmentStatus = req.body.employmentStatus;
            const newTourist = new Tourist({ email, userName, password : hashedPassword, mobileNumber, nationality, DOB, employmentStatus });
            await newTourist.save();
            res.status(201).json(newTourist);
        }
        if (role === "Guide") {
            const mobileNumber = req.body.mobileNumber;
            const yearsOfExperience = req.body.yearsOfExperience;
            const previousWork = req.body.previousWork;
            const nationalId = req.body.nationalIdUrl;
            const certificates = req.body.certificatesUrl;
            const newTourGuide = new TourGuide({ email, userName, password : hashedPassword, mobileNumber, yearsOfExperience, previousWork, nationalId, certificates });
            await newTourGuide.save();
            res.status(201).json(newTourGuide);
        }
        if (role === "Seller") {
            const description = req.body.description;
            const name = req.body.name;
            const uploads = req.body.uploads;
            const newSeller = new Seller({email, userName, password: hashedPassword, name,description ,uploads});
            await newSeller.save();
            res.status(201).json(newSeller);
        }
        if (role === "Advertiser") {
            const websiteLink = req.body.websiteLink;
            const hotline = req.body.hotline;
            const companyProfile = req.body.companyProfile;
            const uploads = req.body.uploads;
            const newAdvertiser = new Advertiser({email, userName, password : hashedPassword,  websiteLink, hotline, companyProfile, uploads});
            await newAdvertiser.save();
            res.status(201).json(newAdvertiser);
        }
         

        const newuser = new User({ role, userName, password: hashedPassword, status });
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

        //const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")

        // if(!user || !isPasswordCorrect){
        //     return res.status(400).json({error: "Incorrect UserName or Password"});
        // }

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

            generateToken(user.userName, res);

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

const logout = (req,res) => {
    try{
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"Logged Out Successfully"});

    }catch(error){
        console.log("Error in Logout Controller", error.message)
        res.status(500).json({error:"Internal Server Error"})
    }
}



module.exports = { signUp, login, logout };