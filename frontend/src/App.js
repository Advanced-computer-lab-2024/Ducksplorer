import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './Pages/Signup';
import CreateItinerary from './Pages/Itinerary/createItinerary';



function App() {

  return (
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/signUp" element={<Signup />} />
          <Route path="/" element={<CreateItinerary />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
}



export default App;
