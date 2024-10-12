const express = require("express");
const mongoose = require("mongoose");
const complaint = require("../../Models/complaintModel");

const sortComplaints = async (req, res) => {
  try {
    const { sortBy, sortOrder } = req.query; // get the sortBy parameter from the query
    let sortOption = {};
    if (sortBy === "date") {
      sortOption.date = sortOrder === "desc" ? -1 : 1; //make the default asc
      // 1 for ascending, -1 for descending
    }
    const complaints = await complaint.find({}).sort(sortOption);

    if (!complaints.length) {
      return res.status(404).json({ error: "No complaints found" });
    }

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Error fetching complaints", error });
  }
};

module.exports = { sortComplaints };
