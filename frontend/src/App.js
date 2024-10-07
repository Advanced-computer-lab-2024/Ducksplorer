import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./Pages/Signup.js";
import AdminDashboard from "./Components/AdminDashboard.js";
import ApproveUsers from "./Pages/Admin/ApproveUsers.js";
import DeleteUser from "./Pages/Admin/DeleteUsers.js";
import AddAdmin from "./Pages/Admin/AddAdmin.js";
import AddGoverner from "./Pages/Admin/AddGovernor.js";
import CategoriesActions from "./Pages/Admin/CategoriesActions.js";
import PreferenceTags from "./Pages/Admin/PreferenceTags.js";
import Login from "./Pages/Login.js";
import AddActivity from "./Pages/AddActivity.js";
import RUDActivity from "./Pages/RUDActivity.js";
import UpcomingActivities from "./Pages/upcomingActivities.js";
import SearchActivities from "./Pages/searchActivity.js";
import SortFilterActivity from "./Pages/SortFilterActivity";
import MyActivities from "./Pages/myActivities.js";
import AdvertiserDashboard from "./Pages/AdvertiserDashboard.js";
import ClinicLocation from "./Pages/location.js";
import Products from './Components/ProductDashboard.js';
import AllProducts from './Pages/AllProducts.js';
import AddProducts from './Pages/AddProducts.js';
import FilterProducts from './Pages/FilterProducts.js';
import SearchProducts from './Pages/SearchProducts.js';
import SortProducts from './Pages/SortProducts.js' ; 
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
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<Signup />} />
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/pendingusers" element={<ApproveUsers />} />
          <Route path="/deleteusers" element={<DeleteUser />} />
          <Route path="/addAdmin" element={<AddAdmin />} />
          <Route path="/addGovernor" element={<AddGoverner />} />
          <Route path="/categoriesActions" element={<CategoriesActions />} />
          <Route path="/preferenceTags" element={<PreferenceTags />} />
          <Route path="/activity/addActivity" element={<AddActivity />} />
          <Route path="/activity/rudActivity" element={<RUDActivity />} />
          <Route path="/activity/upcoming" element={<UpcomingActivities />} />
          <Route
            path="/activity/searchActivities"
            element={<SearchActivities />}
          />
          <Route path="/activity/SortFilter" element={<SortFilterActivity />} />
          <Route
            path="/activity/myActivities"
            element={
              <MyActivities
                userName={JSON.parse(localStorage.getItem("user")).username}
              />
            }
          />
          <Route path="/advertiser" element={<AdvertiserDashboard />} />
          <Route path="/location" element={<ClinicLocation/>} />
          <Route path = "/products" element= {<Products/>} />
        <Route path = "/AllProducts" element= {<AllProducts/>} />
        <Route path = "/AddProducts" element= {<AddProducts/>} />
        <Route path = "/FilterProducts" element= {<FilterProducts/>} />
        <Route path = "/SearchProducts" element= {<SearchProducts/>} />
        <Route path = "/SortProducts" element = {<SortProducts/>} />
        <Route path = "/ViewMyProducts" element = {<ViewMyProducts/>} />
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
