const complaint = require("../../Models/complaintModel");
const mongoose = require("mongoose");

const createComplaint = async (req, res) => {
  const { title, body, date, tourist } = req.body;
  try {
    const newComplaint = new complaint({ title, body, date, tourist });
    await newComplaint.save();
    res.status(201).json(newComplaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateComplaints = async (req, res) => {
  try {
    const { status, response } = req.body;
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID invalid" });
    }
    const updatedComplaint = await complaint.findByIdAndUpdate(
      id,
      { status: status, response: response },
      { new: true }
    );
    if (!updatedComplaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res.status(200).json(updatedComplaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllComplaints = async (req, res) => {
  try {
    const Complaints = await complaint.find();
    res.status(200).json(Complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getComplaintByID = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID invalid" });
    }
    const targetComplaint = await complaint.findById(id);
    if (!targetComplaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }
    res.status(200).json(targetComplaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyComplaints = async (req, res) => {
  try {
    const { touristName } = req.params;
    const complaints = await complaint.find({ tourist: touristName });

    if(!complaints) {
      return res.status(404).json({ message: "No complaints found" });
    }

    res.status(200).json(complaints);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComplaint,
  updateComplaints,
  getAllComplaints,
  getComplaintByID,
  getMyComplaints
};
