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

router.route("/").get(getAllComplaints);//done but not tested
router.route("/").post(createComplaint); // done but not tested
router.route("/sort").get(sortComplaints);//done but not tested
router.route("/filter").get(filterComplaints);//done but not tested
router.route("/myComplaints/:touristName").get(getMyComplaints);//done but not tested
router.route("/:id").get(getComplaintByID).put(updateComplaints); // done but not tested
router.route("/:id/reply").post(addReplyToComplaint); // done but not tested

module.exports = router;
