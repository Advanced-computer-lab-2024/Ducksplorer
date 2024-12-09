const express = require("express");
const {
  deleteUser,
  addAdmin,
  addGovernor,
  approveUser,
  getPendingUsers,
  getUsers,
  rejectUser,
  getPendingUserDetails,
  changePassword,
} = require("../../Controllers/Admin/AdminController.js");

const {
  viewAllProducts,
  viewAllItineraries,
  viewAllActivities,
  filterAllActivities,
  filterAllItineraries,
  filterAllProducts,
  getAllUsersWithEmails,
  getAllUsersWithEmailsFilteredByMonth, calculateTotalBookingsAndEarnings, calculateTotalBookingsAndEarningsWithFilters,
  calculateTotalItineraryBookingsAndEarnings, calculateTotalItineraryBookingsAndEarningsWithFilters,
  calculateTotalProductBookingsAndEarnings, calculateTotalProductBookingsAndEarningsWithFilters
} = require("../../Controllers/Reports/adminReport.js");

const { createPromoCode } = require("../../Controllers/promoCodeController.js");

const router = express.Router();

router.get("/getTotalActivityBookAndEarn",calculateTotalBookingsAndEarnings);
router.get("/getTotalActivityBookAndEarnFilter",calculateTotalBookingsAndEarningsWithFilters);

router.get("/getTotalItineraryBookAndEarn",calculateTotalItineraryBookingsAndEarnings);
router.get("/getTotalItineraryBookAndEarnFilter",calculateTotalItineraryBookingsAndEarningsWithFilters);

router.get("/getTotalProductBookAndEarn",calculateTotalProductBookingsAndEarnings);
router.get("/getTotalProductBookAndEarnFilter",calculateTotalProductBookingsAndEarningsWithFilters);


router.post("/addAdmin", addAdmin); //done

router.post("/addGovernor", addGovernor); //done

router.delete("/deleteuser", deleteUser); // done

router.route("/acceptReject").put(approveUser).delete(rejectUser); //done

router.get("/getpending", getPendingUsers); //done

router.get("/", getUsers); //done

router.get("/pendingDetails", getPendingUserDetails); //done bas betawel awy

router.post("/changePassword", changePassword); //done

router.get("/reportItineraries", viewAllItineraries); //done

router.get("/reportActivities", viewAllActivities); //done

router.get("/reportProducts", viewAllProducts); //done

router.route("/filterReportActivities").get(filterAllActivities); //done

router.route("/filterReportItineraries").get(filterAllItineraries); //done

router.route("/filterReportProducts").get(filterAllProducts); //done

router.get("/getAllUsersWithEmails", getAllUsersWithEmails); //done

router.get(
  "/getAllUsersWithEmailsFilteredByMonth",
  getAllUsersWithEmailsFilteredByMonth 
); //done

router.post("/addPromoCode", createPromoCode);

module.exports = router;
