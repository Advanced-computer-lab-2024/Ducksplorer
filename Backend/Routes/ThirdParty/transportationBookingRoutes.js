const express = require("express");

const router = express.Router();

const  {getTransferOffers,transportationBooking}  = require("../../Controllers/ThirdParty/bookings.js");

router.post('/transfer-offers', getTransferOffers);
router.put('/transportation-booking',transportationBooking);



module.exports = router;