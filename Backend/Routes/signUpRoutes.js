const express = require("express");
const authentication = require("../Controllers/authentication.js")

const router = express.Router();

router.post("/", authentication.signUp);
router.post("/login",authentication.login);

router.post("/login", authentication.login);

module.exports = router;