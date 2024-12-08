const express = require("express");
const { getSellerDetails, updateSellerDetails, removeFileUrl, deleteMySellerAccount } = require("../Controllers/sellerAccount.js");

const router = express.Router();

router.get("/viewaccount/:userName", getSellerDetails);//done

router.put("/editaccount", updateSellerDetails);//done but not tested

router.post('/removeFileUrl', removeFileUrl);//done but not tested

router.delete("/deleteMySellerAccount/:userName", deleteMySellerAccount);//done but not tested


module.exports = router;