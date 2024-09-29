const express = require("express");
const { deleteUser, addAdmin, addGovernor , approveUser ,getPendingUsers , getUsers } = require("../Controllers/Admin/AdminController.js");

const router = express.Router();

router.post("/addAdmin", addAdmin);

router.post("/addGovernor", addGovernor);

router.delete("/deleteuser", deleteUser);

router.put("/approveuser" , approveUser);

router.get("/getpending" , getPendingUsers); 

router.get("/" , getUsers);


module.exports = router;