const express = require("express");
const authentication = require("../Controllers/authentication.js");

const router = express.Router();

router.post("/", authentication.signUp);//done but not tested
router.post("/login", authentication.login);//done
router.post("/logout", authentication.logout);//done 
router.post("/forgetPassword", authentication.forgetPassword);//done
router.get("/getMail/:userName", authentication.getMail);//done

module.exports = router;
