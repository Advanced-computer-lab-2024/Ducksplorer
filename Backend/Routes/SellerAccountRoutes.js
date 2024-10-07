const express = require("express");
const { getSellerDetails, updateSellerDetails } = require("../Controllers/sellerAccount.js");

const router = express.Router();

router.get("/viewaccount/:userName", getSellerDetails);

router.put("/editaccount", updateSellerDetails);

module.exports = router;