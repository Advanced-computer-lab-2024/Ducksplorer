import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './Pages/Signup';
import CreateItinerary from './Pages/Itinerary/createItinerary';
import RUDItinerary from './Pages/Itinerary/RUDItinerary';



function App() {

  return (
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/signUp" element={<Signup />} />
          <Route path="/createItinerary" element={<CreateItinerary />} />
          <Route path="/rudItinerary" element={<RUDItinerary />} />        
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
}



export default App;
