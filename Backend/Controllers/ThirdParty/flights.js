const Amadeus = require ('amadeus');
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
        adults: '1',
        max: '7',
    }).then(function (response) {
        res.send(JSON.stringify(response.result));
    }).catch(function (response) {
        res.status(500).json({error : response.result});
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

module.exports = {getCityCode, getFlights};