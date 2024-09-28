const express = require("express");

const router = express.Router();

const signUpRoutes = require("./signUpRoutes.js");

router.use("/signUp", signUpRoutes);