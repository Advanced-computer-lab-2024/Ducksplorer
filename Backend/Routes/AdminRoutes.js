const express = require("express");
const { deleteUser, addUser } = require("../Controllers/Admin/AdminController.js");

const router = express.Router();

router.post("/adduser", addUser);

router.delete("/deleteuser", deleteUser);

module.exports = router;