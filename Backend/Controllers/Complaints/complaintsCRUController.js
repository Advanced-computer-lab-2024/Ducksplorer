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
    const { date, status } = req.query; // Retrieve date and status filters from query parameters
    let filter = {};

    // Apply status filter if provided
    if (status !== undefined) {
      filter.status = status === 'true'; // Convert "true"/"false" to Boolean
    }

    // Fetch and sort complaints based on date and status filter
    let complaints;
    if (date === 'newest') {
      complaints = await complaint.find(filter).sort({ date: -1 }); // Sort by date descending
    } else if (date === 'oldest') {
      complaints = await complaint.find(filter).sort({ date: 1 }); // Sort by date ascending
    } else {
      complaints = await complaint.find(filter); // No sorting if no date filter provided
    }

    res.status(200).json(complaints);
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
    if (complaints.length === 0) {
      return res.status(404).json({ message: "No complaints found" });
    }
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addReplyToComplaint = async (req, res) => {
  const { id } = req.params; // Complaint ID
  const { reply } = req.body; // Use `reply` from request body
  console.log(id);
  try {
    const complaintData = await complaint.findById(id); // Use `complaint` instead of `Complaint`
    if (!complaintData) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    // Add the new reply to the `replies` array
    complaintData.replies.push({ text: reply });
    await complaintData.save();

    res.status(200).json(complaintData);
  } catch (error) {
    res.status(500).json({ error: "Failed to add reply" });
  }
};


module.exports = {
  createComplaint,
  updateComplaints,
  getAllComplaints,
  getComplaintByID,
  getMyComplaints,
  addReplyToComplaint,
};
