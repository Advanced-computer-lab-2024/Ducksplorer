const Amadeus = require ('amadeus');
const Tourist = require("../../Models/touristModel.js");
const amadeus = new Amadeus({
    clientId: 'mQWkCSAT4GpgFsRaesWzWkPgnlKRDP9S',
    clientSecret: 'tnCMwPiJgwqiD5an',
});
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

const touristBooking =async(req, res) => {
    const {price} = req.body.price;
    const {tourist} = Tourist.findOne({userName: req.body.userName});
    const {wallet} = tourist.wallet;

    if(wallet >= price){
        const newWallet = wallet - price;
        const updatedTourist = await Tourist.findOneAndUpdate({userName: req.params.userName}, {wallet: newWallet});
        res.status(200).send(updatedTourist);
    } else {
        res.status(400).send({
            status: 400,
            code: 426,
            title: "INSUFFICIENT FUNDS",
            detail: "The tourist does not have enough funds for the booking"
        });
    }
}

module.exports = {getCityCode, getFlights,touristBooking};