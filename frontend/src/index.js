import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import App from './App';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import DropDown from './Components/DropDown.js';
import TextSection from './Components/TextSection.js';
import FormSection from './Components/FormSection.js';
import Header from './Components//TopNav/header.js';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path = "/signUp" element=  {<Header/>} />  
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
  
);


