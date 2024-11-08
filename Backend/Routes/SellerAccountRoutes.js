const express = require("express");
const { getSellerDetails, updateSellerDetails, removeFileUrl } = require("../Controllers/sellerAccount.js");

const router = express.Router();

router.get("/viewaccount/:userName", getSellerDetails);

router.put("/editaccount", updateSellerDetails);

router.post('/removeFileUrl', removeFileUrl);

module.exports = router;