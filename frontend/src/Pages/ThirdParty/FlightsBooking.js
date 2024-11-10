import React from "react";
import TouristNavBar from "../../Components/TouristNavBar";
import FlightBookingForm from "../../Components/ThirdParty/FlightBookingForm";
import Help from "../../Components/HelpIcon";

const FlightsBooking = () => {
  return (
    <>
      <TouristNavBar />
      <FlightBookingForm />
      <Help />
    </>
  );
};

export default FlightsBooking;
