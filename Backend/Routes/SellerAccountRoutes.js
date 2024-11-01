const express = require("express");
const { getSellerDetails, updateSellerDetails, deleteSeller } = require("../Controllers/sellerAccount.js");

const router = express.Router();

router.get("/viewaccount/:userName", getSellerDetails);

router.put("/editaccount", updateSellerDetails);

router.delete("/deleteSeller/:userName", deleteSeller);


module.exports = router;