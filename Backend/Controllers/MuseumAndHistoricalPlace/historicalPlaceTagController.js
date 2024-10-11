const historicalPlaceTagModel = require('../../Models/museumHistoricalPlaceModels/historicalPlaceTagModel');//to get out of our folder then out of the controller folder

const addHistoricalPlaceTag = async (req, res) => {
    try {
        const { historicalPlaceTag } = req.body;
        const newHistoricalPlaceTag = new historicalPlaceTagModel({
            historicalPlaceTag
        });

        await newHistoricalPlaceTag.save();

        res.status(201).json({ message: "Historical Place Tag created successfully", newHistoricalPlaceTag });
    }
    catch (error) {
        res.status(400).json({ message: "Error creating Historical Place Tag", error: error.message });
    }
}

// Retrieve all Historical Place Tags 
const getAllHistoricalPlaceTags = async (req, res) => {
    try {
        const historicalPlaceTags = await historicalPlaceTagModel.find();
        if (!historicalPlaceTags) {
            return res.status(404).json({ message: "Historical Place Tag not found" });
        }
        res.status(200).json(historicalPlaceTags);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving Historical Place Tag", error: error.message });
    }
};


module.exports = { addHistoricalPlaceTag, getAllHistoricalPlaceTags };
