import './App.css';
import React from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Signup from './Routes/Signup.js';

   

 
function App() {

  return (
    <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path = "/signUp" element=  {<Signup/>} />  
      </Routes>
    </BrowserRouter>
    </React.StrictMode>
  );
}



export default App;
