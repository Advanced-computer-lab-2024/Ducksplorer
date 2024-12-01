const express = require("express");
const authentication = require("../Controllers/authentication.js");

const router = express.Router();

router.post("/", authentication.signUp);
router.post("/login", authentication.login);
router.post("/logout", authentication.logout);
router.post("/forgetPassword", authentication.forgetPassword);
router.get("/getMail/:userName", authentication.getMail);

module.exports = router;
