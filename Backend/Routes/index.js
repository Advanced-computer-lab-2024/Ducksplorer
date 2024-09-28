const express = require("express");

const router = express.Router();

const signUpRoutes = require("./signUpRoutes.js");
//const productRouter = require("./sellerRoutes.js");

router.use("/signUp", signUpRoutes);
//router.use("/products", productRouter);