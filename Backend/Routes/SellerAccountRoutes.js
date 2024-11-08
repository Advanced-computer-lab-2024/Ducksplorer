const express = require("express");
const { getSellerDetails, updateSellerDetails, deleteMySellerAccount } = require("../Controllers/sellerAccount.js");

const router = express.Router();

router.get("/viewaccount/:userName", getSellerDetails);

router.put("/editaccount", updateSellerDetails);

router.delete("/deleteMySellerAccount/:userName", deleteMySellerAccount);


module.exports = router;