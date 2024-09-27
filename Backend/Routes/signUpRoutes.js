const express = require("express");
const authentication = require("../Controllers/authentication")

const router = express.Router();

router.post("/", authentication.signUp);

module.exports = router;