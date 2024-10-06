const preferenceTags = require("../Models/preferenceTagsModels");

const createTags = async (req,res) => {
    const { name } = req.body;
    try {
        const newTag = new preferenceTags({ name });
        await newTag.save();
        res.status(201).json(newTag);   
    } catch (error) {
        res.status(400).json({ message: error.message });
      }
};


const deleteTags = async (req,res) => {
    const { name } = req.body;
    try {
        const deletedTag = await preferenceTags.findOneAndDelete({name});
        if (!deletedTag) {
            return res.status(404).json({ message: 'Tag not found' });
        }
          res.status(200).json({ message: 'Tag deleted successfully' });
    } catch (error) {
          res.status(500).json({ message: error.message });
      }
};


const updateTags = async (req,res) => {
    const { currentName, newName } = req.body;
    try {
      const updatedTag = await preferenceTags.findOneAndUpdate(
        { name: currentName },
        { name: newName},
        { new: true }
      );
      if (!updatedTag) {
        return res.status(404).json({ message: 'Tag not found' });
      }
      res.status(200).json(updatedTag);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
};




const getTagsbyName = async (req, res) => {
    try {
      const {name} = req.body;
      const Tags = await preferenceTags.find({name});
      console.log(Tags);
      if (!Tags || Tags.length === 0) {
        return res.status(404).json({ message: 'Tags not found' });
      }
      res.status(200).json(Tags);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  const getAllTags = async (req, res) => {
    try {
      const Tags = await preferenceTags.find();
      res.status(200).json(Tags);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  module.exports = {
    createTags,
    deleteTags,
    updateTags,
    getTagsbyName,
    getAllTags
  };