import React from "react";
import TouristNavBar from "../../Components/TouristNavBar";
import FlightBookingForm from "../../Components/ThirdParty/FlightBookingForm";
import Help from "../../Components/HelpIcon";
import TouristSidebar from "../../Components/Sidebars/TouristSidebar";
const FlightsBooking = () => {
  return (
    <>
      <TouristNavBar />
      <TouristSidebar/>
      <FlightBookingForm />
      <Help />
    </>
  );
};

export default FlightsBooking;
