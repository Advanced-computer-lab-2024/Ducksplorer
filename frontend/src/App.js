import './App.css';
import React from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Signup from './Pages/Signup.js';
import Products from './Components/ProductDashboard.js';
import AllProducts from './Pages/AllProducts.js';
import AddProducts from './Pages/AddProducts.js';


   

function App() {

  return (
    <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path = "/signUp" element=  {<Signup/>} /> 
        <Route path = "/products" element= {<Products/>} />
        <Route path = "/AllProducts" element= {<AllProducts/>} />
        <Route path = "/AddProducts" element= {<AddProducts/>} />
      </Routes>
    </BrowserRouter>
    </React.StrictMode>
  );
}



export default App;
