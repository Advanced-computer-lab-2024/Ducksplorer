import React from 'react';
import TouristNavBar from '../../Components/TouristNavBar';
import TransportationBookingForm from '../../Components/ThirdParty/TransportationBookingForm';
import TouristSidebar from '../../Components/Sidebars/TouristSidebar';




const TransportationBooking = () => {
 

  return (
    <>
      <TouristNavBar />
      <TransportationBookingForm/>
    </>
  );
};

export default TransportationBooking;