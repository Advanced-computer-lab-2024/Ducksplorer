
const User = require("../Models/userModel.js");
const jwt = require('jsonwebtoken');

    const protectRoute = async (req, res, next) => {
    try{
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({error: "Unauthorized Access - No Token"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({error: "Unauthorized Access - Invalid Token"});
        }

        const user = await User.findOne(decoded.userName).select("-password")
        if(!user){
            return res.status(401).json({error: "User Not Found"});
        }

        req.user = user;

        next();

    }catch(error){
        console.log("Error in Protect Route Middelware ", error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
}

module.exports = protectRoute;