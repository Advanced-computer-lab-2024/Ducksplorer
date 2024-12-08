import React from "react";
import TouristNavBar from "../../Components/TouristNavBar";
import TransportationBookingForm from "../../Components/ThirdParty/TransportationBookingForm";
import TouristSidebar from "../../Components/Sidebars/TouristSidebar";
import Help from "../../Components/HelpIcon";

const TransportationBooking = () => {
  return (
    <>
      <TouristNavBar />
      <TransportationBookingForm />
      <Help />
    </>
  );
};

export default TransportationBooking;
