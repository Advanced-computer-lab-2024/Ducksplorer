const museumTagModel = require('../../Models/museumHistoricalPlaceModels/museumTagModel');//to get out of our folder then out of the controller folder
// file created to contain all functions that the routes will reference instead of hard coding them in the routes folder

const addMuseumTag = async (req, res) => {
    try {
        const { museumTag } = req.body;
        const newMuseumTag = new museumTagModel({
            museumTag
        });

        await newMuseumTag.save();

        res.status(201).json({ message: "Museum Tag created successfully", newMuseumTag });
    }
    catch (error) {
        res.status(400).json({ message: "Error creating Museum Tag", error: error.message });
    }
}

// Retrieve all Museums Tags
const getAllMuseumTags = async (req, res) => {
    try {
        const museumTags = await museumTagModel.find();
        if (!museumTags) {
            return res.status(404).json({ message: "Museum Tag not found" });
        }
        res.status(200).json(museumTags);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving Museum Tag", error: error.message });
    }
};


module.exports = { addMuseumTag, getAllMuseumTags };
//must export so that we can reference them inside the routes folder