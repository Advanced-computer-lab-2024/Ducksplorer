import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './Pages/Signup';
import CreateItinerary from './Pages/Itinerary/createItinerary';
import RUDItinerary from './Pages/Itinerary/RUDItinerary';
import ViewUpcomingItinerary from './Pages/Itinerary/viewUpcomingItinerary';
import ViewAllTourist from './Pages/Itinerary/viewAllTourist';
import Login from './Pages/Login.js';
import TourGuideDashboard from './Pages/TourGuideDashboard';
import TouristDashboard from './Pages/TouristDashboard';


function App() {

  return (
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path ="/login" element={<Login/>} />
          <Route path = "/signUp" element=  {<Signup/>} />  
          <Route path="/createItinerary" element={<CreateItinerary />} />
          <Route path="/rudItinerary" element={<RUDItinerary />} />
          <Route path="/viewUpcomingItinerary" element={<ViewUpcomingItinerary />} />
          <Route path="/viewAllTourist" element={<ViewAllTourist />} />
          <Route path="/tourGuideDashboard" element={<TourGuideDashboard />} />
          <Route path="/touristDashboard" element={<TouristDashboard />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
}



export default App;
