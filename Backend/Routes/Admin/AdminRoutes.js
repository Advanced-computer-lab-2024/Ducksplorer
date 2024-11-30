const express = require("express");
const { deleteUser, addAdmin, addGovernor, approveUser, getPendingUsers, getUsers, rejectUser, getPendingUserDetails, changePassword } = require("../../Controllers/Admin/AdminController.js");

const { viewAllProducts, viewAllItineraries, viewAllActivities } = require("../../Controllers/Reports/adminReport.js");

const { getAllUsersWithEmails, getAllUsersWithEmailsFilteredByMonth } = require('../../Controllers/Reports/adminReport.js')

const router = express.Router();

router.post("/addAdmin", addAdmin);

router.post("/addGovernor", addGovernor);

router.delete("/deleteuser", deleteUser);

router.route("/acceptReject").put(approveUser).delete(rejectUser); //done

router.get("/getpending", getPendingUsers); //done

router.get("/", getUsers);

router.get("/pendingDetails", getPendingUserDetails) //done

router.post("/changePassword", changePassword);

router.get("/reportItineraries", viewAllItineraries);

router.get("/reportActivities", viewAllActivities);

router.get("/reportProducts", viewAllProducts);

router.get("/getAllUsersWithEmails", getAllUsersWithEmails);

router.get("/getAllUsersWithEmailsFilteredByMonth", getAllUsersWithEmailsFilteredByMonth);

module.exports = router;
