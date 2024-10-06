import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './Pages/Signup.js';
import CreateVisit from './Pages/MuseumHistoricalPlace/CreateVisit.js';
import CreateHistoricalPlace from './Pages/MuseumHistoricalPlace/CreateHistoricalPlace.js';
import CreateMuseum from './Pages/MuseumHistoricalPlace/CreateMuseum.js';
import RUDVisit from './Pages/MuseumHistoricalPlace/RUDVisit.js';
import RUDMuseum from './Pages/MuseumHistoricalPlace/RUDMuseum.js';
import RUDHistoricalPlace from './Pages/MuseumHistoricalPlace/RUDHistoricalPlace.js';
import MuseumTouristPov from './Pages/MuseumHistoricalPlace/MuseumTouristPov.js';
import HistoricalPlaceTouristPov from './Pages/MuseumHistoricalPlace/HistoricalPlaceTouristPov.js';
import UpcomingHistoricalPlaces from './Pages/MuseumHistoricalPlace/UpcomingHistoricalPlaces.js';
import UpcomingMuseums from './Pages/MuseumHistoricalPlace/UpcomingMuseums.js';
import CreateTagMuseum from './Pages/MuseumHistoricalPlace/CreateTagMuseum.js';
import CreateTagHistoricalPlace from './Pages/MuseumHistoricalPlace/CreateTagHistoricalPlace.js';

function App() {

  return (
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/signUp" element={<Signup />} />
          <Route path="/createVisit" element={<CreateVisit />} />
          <Route path="/createMuseum" element={<CreateMuseum />} />
          <Route path="/createHistoricalPlace" element={<CreateHistoricalPlace />} />
          <Route path="/RUDMuseum" element={<RUDMuseum />} />
          <Route path="/RUDHistoricalPlace" element={<RUDHistoricalPlace />} />
          <Route path="/RUDVisit" element={<RUDVisit />} />
          <Route path="/MuseumTouristPov" element={<MuseumTouristPov />} />
          <Route path="/HistoricalPlaceTouristPov" element={<HistoricalPlaceTouristPov />} />
          <Route path="/UpcomingHistoricalPlaces" element={<UpcomingHistoricalPlaces />} />
          <Route path="/UpcomingMuseums" element={<UpcomingMuseums />} />
          <Route path="/createTagMuseum" element={<CreateTagMuseum />} />
          <Route path="/createTagHistoricalPlace" element={<CreateTagHistoricalPlace/>} />


        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
}



export default App;
