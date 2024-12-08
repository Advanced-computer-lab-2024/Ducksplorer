const axios = require('axios');
const Amadeus = require ('amadeus');
const Tourist = require("../../Models/touristModel.js");
const database = require('mime-db');
const amadeus = new Amadeus({
    clientId: 'mQWkCSAT4GpgFsRaesWzWkPgnlKRDP9S',
    clientSecret: 'tnCMwPiJgwqiD5an',
});
// console.log(Object.keys(amadeus.shopping));


const getToken = async () => {
    try {
        const response = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token', {
            grant_type: 'client_credentials',
            client_id: 'mQWkCSAT4GpgFsRaesWzWkPgnlKRDP9S',
            client_secret: 'tnCMwPiJgwqiD5an',
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response.data.access_token;
    } catch (error) {
        console.error("Error obtaining token:", error);
        return null;
    }
};


const getCityCode = async (req, res) => {
    const {city} = req.params;
    // Which cities or airports start with the parameter variable
    amadeus.referenceData.locations
        .get({
            keyword: city,
            subType: Amadeus.location.any,
        })
        .then(function (response) {
            res.send(response.result.data[0].address.cityCode);
        })
        .catch(function (response) {
            res.send(response);
        });
};

const getFlights = async (req, res) => {
    const originCode = req.body.originCode;
    const destinationCode = req.body.destinationCode;
    const dateOfDeparture = req.body.dateOfDeparture;
    const seats = req.body.seats.toString();

    // Check if the date of departure is in the past
    const currentDate = new Date();
    const departureDate = new Date(dateOfDeparture);

    if (departureDate < currentDate) {
        return res.status(400).send({
            status: 400,
            code: 425,
            title: "INVALID DATE",
            detail: "Date/Time is in the past"
        });
    }

    // Find the cheapest flights
    amadeus.shopping.flightOffersSearch.get({
        originLocationCode: originCode,
        destinationLocationCode: destinationCode,
        departureDate: dateOfDeparture,
        adults: seats,
        max: '6',
    }).then(function (response) {
        res.send(JSON.stringify(response.result));
    }).catch(function (response) {
        res.status(500).json({error : response.error});
    });
};
/*get number of bookable seats:

response.result.data[0].numberOfBookableSeats
*/

/*get the flight price:

response.result.data[0].price.total 
*/

/* get the currency of the flight price:

response.result.data[0].price.currency
*/

/* get the flight company name:

response.result.data[0].itineraries[0].segments[0].carrierCode
*/
// const transportationBooking = async(req,res) => {
//     const {price} = req.body.quotation.monetaryAmount;
//     const {tourist} = Tourist.findOne({userName: req.body.userName});
//     const {wallet} = tourist.wallet;

//     if(wallet >= price){
//         const newWallet = wallet - price;
//         const updatedTourist = await Tourist.findOneAndUpdate({userName: req.params.userName}, {wallet: newWallet});
//         res.status(200).send(updatedTourist);
//     } else {
//         res.status(400).send({
//             status: 400,
//             code: 426,
//             title: "INSUFFICIENT FUNDS",
//             detail: "The tourist does not have enough funds for the booking"
//         });
//     }


// }

// const touristBooking =async(req, res) => {
//     const {price} = req.body.price;
//     const {tourist} = Tourist.findOne({userName: req.body.userName});
//     const {wallet} = tourist.wallet;

//     if(wallet >= price){
//         const newWallet = wallet - price;
//         const updatedTourist = await Tourist.findOneAndUpdate({userName: req.params.userName}, {wallet: newWallet});
//         res.status(200).send(updatedTourist);
//     } else {
//         res.status(400).send({
//             status: 400,
//             code: 426,
//             title: "INSUFFICIENT FUNDS",
//             detail: "The tourist does not have enough funds for the booking"
//         });
//     }
// }


const getTransferOffers = async (req, res) => {
    const token = await getToken();
    if (!token) {
        return res.status(401).send("Unauthorized");
    }

    const {
        startLocationCode,
        endAddressLine,
        endCountryCode,
        transferType,
        startDateTime,
        duration,
        endGeoCode="0,0"
    } = req.body; 

    try {
        const response = await axios.post('https://test.api.amadeus.com/v1/shopping/transfer-offers', {
            startLocationCode,
            endAddressLine,
            endCountryCode,
            endGeoCode,    //alatool b 0 w khalas msh fare2 f haga
            transferType,
            startDateTime,
            duration
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        // console.log(response.data.data[0].quotation.monetaryAmount);
        return res.status(200).json(response.data); // Send the response back to the client
        
    } catch (error) {
        console.error("Error calling transferOffers:", error);
        return res.status(500).send("Error calling transferOffers");
    }
};






// module.exports = {getCityCode, getFlights,touristBooking,transportationBooking,getTransferOffers};
module.exports = {getCityCode, getFlights,getTransferOffers};