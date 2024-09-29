const express = require("express");
const authentication = require("../Controllers/authentication.js")

const router = express.Router();

router.post("/", authentication.signUp);
module.exports = router;