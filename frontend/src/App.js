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
import TouristEditAccount from './Pages/TouristEditAccount.js';
import CreateHistoricalPlace from './Pages/MuseumHistoricalPlace/CreateHistoricalPlace.js';
import CreateMuseum from './Pages/MuseumHistoricalPlace/CreateMuseum.js';
// import RUDVisit from './Pages/MuseumHistoricalPlace/RUDVisit.js';
import RUDMuseum from './Pages/MuseumHistoricalPlace/RUDMuseum.js';
import RUDHistoricalPlace from './Pages/MuseumHistoricalPlace/RUDHistoricalPlace.js';
import MuseumTouristPov from './Pages/MuseumHistoricalPlace/MuseumTouristPov.js';
import HistoricalPlaceTouristPov from './Pages/MuseumHistoricalPlace/HistoricalPlaceTouristPov.js';
import UpcomingHistoricalPlaces from './Pages/MuseumHistoricalPlace/UpcomingHistoricalPlaces.js';
import UpcomingMuseums from './Pages/MuseumHistoricalPlace/UpcomingMuseums.js';
import CreateTagMuseum from './Pages/MuseumHistoricalPlace/CreateTagMuseum.js';
import CreateTagHistoricalPlace from './Pages/MuseumHistoricalPlace/CreateTagHistoricalPlace.js';
import CreateItinerary from './Pages/Itinerary/createItinerary';
import RUDItinerary from './Pages/Itinerary/RUDItinerary';
import ViewUpcomingItinerary from './Pages/Itinerary/viewUpcomingItinerary';
import ViewAllTourist from './Pages/Itinerary/viewAllTourist';
import TourGuideDashboard from './Pages/TourGuideDashboard';
import TouristDashboard from './Pages/TouristDashboard';
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
            <Route path="/createItinerary" element={<CreateItinerary />} />
          <Route path="/rudItinerary" element={<RUDItinerary />} />
          <Route path="/viewUpcomingItinerary" element={<ViewUpcomingItinerary />} />
          <Route path="/viewAllTourist" element={<ViewAllTourist />} />
          <Route path="/tourGuideDashboard" element={<TourGuideDashboard />} />
          <Route path="/touristDashboard" element={<TouristDashboard />} />
          <Route path="/tourGuideEditAccount" element={<TourGuideEditProfile/>} />
  
          <Route path="/governorDashboard" element={<GovernorDashboard />} />
          <Route path="/createMuseum" element={<CreateMuseum />} />
          <Route path="/createHistoricalPlace" element={<CreateHistoricalPlace />} />
          <Route path="/RUDMuseum" element={<RUDMuseum />} />
          <Route path="/RUDHistoricalPlace" element={<RUDHistoricalPlace />} />
          {/* <Route path="/RUDVisit" element={<RUDVisit />} /> */}
          <Route path="/MuseumTouristPov" element={<MuseumTouristPov />} />
          <Route path="/HistoricalPlaceTouristPov" element={<HistoricalPlaceTouristPov />} />
          <Route path="/UpcomingHistoricalPlaces" element={<UpcomingHistoricalPlaces />} />
          <Route path="/UpcomingMuseums" element={<UpcomingMuseums />} />
          <Route path="/createTagMuseum" element={<CreateTagMuseum />} />
          <Route path="/createTagHistoricalPlace" element={<CreateTagHistoricalPlace/>} />


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
            <Route path="/editAccount" element={<TouristEditAccount />} />

          <Route path="/advertiserEditAccount" element={< AdvertiserEditProfile />} />
          <Route path="/sellerEditAccount" element={< SellerEditProfile />} />

          <Route path="/sellerDashboard" element={<SellerDashboard/>} />
      </Routes>
          </BrowserRouter>
    </React.StrictMode>
  );
}

export default App;
