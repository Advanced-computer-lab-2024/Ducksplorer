import './App.css';
import React from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Signup from './Pages/Signup.js';
import ViewAllProducts from './Pages/ViewAllProducts.js';
import SearchPage from './Pages/SearchPage.js';

 
function App() {

  return (
    <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path = "/signUp" element=  {<Signup/>} />  
        <Route path = "/ViewAllProducts" element=  {<ViewAllProducts/>} />  
        <Route path = "/ProductSearch" element=  {<SearchPage/>} />  
      </Routes>
    </BrowserRouter>
    </React.StrictMode>
  );
}



export default App;
