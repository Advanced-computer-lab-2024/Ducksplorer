const express = require('express')
const { createComplaint, updateComplaints, getAllComplaints, getComplaintByID, getMyComplaints } = require('../Controllers/Complaints/complaintsCRUController');
const { sortComplaints } = require('../Controllers/Complaints/complaintSortController');
const { filterComplaints } = require('../Controllers/Complaints/complaintFilterController');
const router = express.Router();

router.route("/").post(createComplaint).get(getAllComplaints) //create, get all

router.route("/:id").get(getComplaintByID).put(updateComplaints) //update, get one

router.route("/sort").get(sortComplaints)

router.route("/filter").get(filterComplaints)

router.route("/myComplaints/:touristName").get(getMyComplaints) 


module.exports = router
