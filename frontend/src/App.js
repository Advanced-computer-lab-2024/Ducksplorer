import './App.css';
import React from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Signup from './Pages/Signup.js';
import Products from './Components/ProductDashboard.js';
import AllProducts from './Pages/AllProducts.js';
import AddProducts from './Pages/AddProducts.js';
import FilterProducts from './Pages/FilterProducts.js';
import SearchProducts from './Pages/SearchProducts.js';
import SortProducts from './Pages/SortProducts.js' ; 
import Login from './Pages/Login.js';
import ViewMyProducts from './Pages/ViewMyProducts.js'
import EditProduct from './Components/EditProduct.js';
import AdminProducts from './Pages/AdminProducts.js';
import AdminAllProducts from './Pages/AdminAllProducts.js';
import TouristAllProducts from './Pages/TouristAllProducts.js';

   

function App() {

  return (
    <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path = "/signUp" element=  {<Signup/>} /> 
        <Route path = "/products" element= {<Products/>} />
        <Route path = "/AllProducts" element= {<AllProducts/>} />
        <Route path = "/AddProducts" element= {<AddProducts/>} />
        <Route path = "/FilterProducts" element= {<FilterProducts/>} />
        <Route path = "/SearchProducts" element= {<SearchProducts/>} />
        <Route path = "/SortProducts" element = {<SortProducts/>} />
        <Route path = "/ViewMyProducts" element = {<ViewMyProducts/>} />
        <Route path ="/login" element={<Login/>} />
        <Route path = "/editProduct/:productId" element={<EditProduct/>} />
        <Route path = "/Adminproducts" element= {<AdminProducts/>} />
        <Route path = "/AdminAllProducts" element= {<AdminAllProducts/>} />
        <Route path = "/TouristAllProducts" element= {<TouristAllProducts/>} />



      </Routes>
    </BrowserRouter>
    </React.StrictMode>
  );
}



export default App;
