import React from 'react';
import TouristNavBar from 'Ducksplorer/frontend/src/Components/TouristNavBar';
import TransportationBookingForm from '../../Components/ThirdParty/TransportationBookingForm';
import TouristSidebar from '../../Components/Sidebars/TouristSidebar';




const TransportationBooking = () => {
 

  return (
    <>
      <TouristNavBar />
      <TouristSidebar/>        
      <TransportationBookingForm/>
    </>
  );
};

export default TransportationBooking;