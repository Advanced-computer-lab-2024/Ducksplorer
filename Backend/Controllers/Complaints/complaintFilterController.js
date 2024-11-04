const express = require("express");
const complaint = require("../../Models/complaintModel");
const mongoose = require("mongoose");

const filterComplaints = async (req, res) => {
  const { status } = req.query;
  try {
    const complaints = await complaint.find({ status });
    res.status(200).json(complaints);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



module.exports = { filterComplaints};

