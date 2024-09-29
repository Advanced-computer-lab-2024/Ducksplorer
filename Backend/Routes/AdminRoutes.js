const express = require("express");
const { deleteUser, addUser , approveUser ,getPendingUsers , getUsers } = require("../Controllers/Admin/AdminController.js");

const router = express.Router();

router.post("/adduser", addUser);

router.delete("/deleteuser", deleteUser);

router.put("/approveuser" , approveUser);

router.get("/getpending" , getPendingUsers); 

router.get("/getusers" , getUsers);


module.exports = router;