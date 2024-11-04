const express = require('express');
const { 
  createComplaint, 
  updateComplaints, 
  getAllComplaints, 
  getComplaintByID, 
  getMyComplaints, 
  addReplyToComplaint // Make sure this is imported
} = require('../Controllers/Complaints/complaintsCRUController');
const { sortComplaints } = require('../Controllers/Complaints/complaintSortController');
const { filterComplaints } = require('../Controllers/Complaints/complaintFilterController');

const router = express.Router();

router.route("/").get(getAllComplaints);
router.route("/").post(createComplaint); // Create, get all complaints
router.route("/sort").get(sortComplaints);
router.route("/filter").get(filterComplaints);
router.route("/myComplaints/:touristName").get(getMyComplaints);
router.route("/:id").get(getComplaintByID).put(updateComplaints); // Update, get one complaint
router.route("/:id/reply").post(addReplyToComplaint); // Add a reply to a complaint

module.exports = router;
