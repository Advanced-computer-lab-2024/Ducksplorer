const express = require("express");
const { deleteUser, addAdmin, addGovernor , approveUser ,getPendingUsers , getUsers, rejectUser, getPendingUserDetails , changePassword } = require("../../Controllers/Admin/AdminController.js");

const router = express.Router();

router.post("/addAdmin", addAdmin);

router.post("/addGovernor", addGovernor);

router.delete("/deleteuser", deleteUser);

router.route("/acceptReject").put(approveUser).delete(rejectUser); //done

router.get("/getpending" , getPendingUsers); //done

router.get("/" , getUsers);

router.get("/pendingDetails", getPendingUserDetails) //done

router.post("/changePassword", changePassword);



module.exports = router;