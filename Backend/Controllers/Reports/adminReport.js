const mongoose = require('mongoose');
const Activity = require('../../Models/activityModel');
const Itinerary = require("../../Models/itineraryModel");
const Product = require("../../Models/productModel");

const viewAllActivities = async (req, res) => {
    try {
      const activities = await Activity.find(); 

      if (activities.length === 0) {
        return res.status(404).json({ message: "No activities found" });
    }
      res.status(200).json(activities);
    } 
    catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  const viewAllItineraries = async (req, res) => {
    try {

        const itineraries = await Itinerary.find();
        if (itineraries.length ===0) {
            return res.status(404).json({ message: "No itineraries found" });
        }
        res.status(200).json(itineraries);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
          }
        };
     
  const viewAllProducts = async (req, res) => {
            try {
        
                const products = await Product.find();
                if (products.length ===0) {
                    return res.status(404).json({ message: "No products found" });
                }
                res.status(200).json(products);
                }
                catch (error) {
                    res.status(500).json({ message: error.message });
                  }
                };
  
module.exports = { viewAllActivities, viewAllItineraries, viewAllProducts};