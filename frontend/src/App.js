import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './Pages/Signup';
import CreateItinerary from './Pages/Itinerary/createItinerary';
import RUDItinerary from './Pages/Itinerary/RUDItinerary';
import ViewUpcomingItinerary from './Pages/Itinerary/viewUpcomingItinerary';
import Trial from './Pages/Itinerary/trialPage';import ViewAllTourist from './Pages/Itinerary/viewAllTourist';
import ViewMyItineraries from './Pages/Itinerary/viewMyItineraries'


function App() {

  return (
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/signUp" element={<Signup />} />
          <Route path="/createItinerary" element={<CreateItinerary />} />
          <Route path="/rudItinerary" element={<RUDItinerary />} /> 
          <Route path="/viewUpcomingItinerary" element={<ViewUpcomingItinerary />} />       
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
}



export default App;
