import React from "react";
import TouristNavBar from "../../Components/TouristNavBar";
import HotelBookingForm from "../../Components/ThirdParty/HotelBookingForm";
import Help from "../../Components/HelpIcon";
import TouristSidebar from "../../Components/Sidebars/TouristSidebar";

const FlightsBooking = () => {
  return (
    <>
 <TouristNavBar />
 <TouristSidebar/>      
      <HotelBookingForm />
      <Help />
    </>
  );
};

export default FlightsBooking;
