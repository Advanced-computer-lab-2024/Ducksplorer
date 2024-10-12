const complaint = require("../../Models/complaintModel");

const createComplaint = async (req, res) => {
  const { title, body, date } = req.body;
  try {
    const newComplaint = new complaint({ title, body, date });
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
    const complaint = await complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }
    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyComplaints = async (req, res) => {
  try {
    const { touristName } = req.params;
    const complaint = await complaint.find({ tourist: touristName });

    if(!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.status(200).json(complaint);

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
