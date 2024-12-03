import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./Pages/Signup.js";
import AdminDashboard from "./Pages/Dashboards/AdminDashboard.js";
import ApproveUsers from "./Pages/Admin/ApproveUsers.js";
import DeleteUser from "./Pages/Admin/DeleteUsers.js";
import AddAdmin from "./Pages/Admin/AddAdmin.js";
import AddGoverner from "./Pages/Admin/AddGovernor.js";
import CategoriesActions from "./Pages/Admin/CategoriesActions.js";
import PreferenceTags from "./Pages/Admin/PreferenceTags.js";
import Login from "./Pages/Login.js";
import AddActivity from "./Pages/Activities/AddActivity.js";
import TouristEditAccount from "./Pages/EditAccount/TouristEditAccount.js";
import CreateHistoricalPlace from "./Pages/MuseumHistoricalPlace/CreateHistoricalPlace.js";
import CreateMuseum from "./Pages/MuseumHistoricalPlace/CreateMuseum.js";
import RUDMuseum from "./Pages/MuseumHistoricalPlace/RUDMuseum.js";
import RUDHistoricalPlace from "./Pages/MuseumHistoricalPlace/RUDHistoricalPlace.js";
import MuseumTouristPov from "./Pages/MuseumHistoricalPlace/MuseumTouristPov.js";
import HistoricalPlaceTouristPov from "./Pages/MuseumHistoricalPlace/HistoricalPlaceTouristPov.js";
import UpcomingHistoricalPlaces from "./Pages/MuseumHistoricalPlace/UpcomingHistoricalPlaces.js";
import UpcomingMuseums from "./Pages/MuseumHistoricalPlace/UpcomingMuseums.js";
import CreateTagMuseum from "./Pages/MuseumHistoricalPlace/CreateTagMuseum.js";
import CreateTagHistoricalPlace from "./Pages/MuseumHistoricalPlace/CreateTagHistoricalPlace.js";
import CreateItinerary from "./Pages/Itinerary/createItinerary";
import RUDItinerary from "./Pages/Itinerary/RUDItinerary";
import ViewUpcomingItinerary from "./Pages/Itinerary/viewUpcomingItinerary";
import ViewAllTourist from "./Pages/Itinerary/viewAllTourist";
import TourGuideDashboard from "./Pages/Dashboards/TourGuideDashboard";
import TouristDashboard from "./Pages/Dashboards/TouristDashboard";
import RUDActivity from "./Pages/Activities/RUDActivity.js";
import UpcomingActivities from "./Pages/Activities/upcomingActivities.js";
import SearchActivities from "./Pages/Activities/searchActivity.js";
import SortFilterActivity from "./Pages/Activities/SortFilterActivity.js";
import MyActivities from "./Pages/Activities/myActivities.js";
import AdvertiserDashboard from "./Pages/Dashboards/AdvertiserDashboard.js";
import ClinicLocation from "./Pages/location.js";
import ProductDashboard from "./Pages/Products/ProductDashboard.js";
import AllProducts from "./Pages/Products/AllProducts.js";
import AddProducts from "./Pages/Products/AddProducts.js";
import FilterProducts from "./Pages/Products/FilterProducts.js";
import SearchProducts from "./Pages/Products/SearchProducts.js";
import SortProducts from "./Pages/Products/SortProducts.js";
import ViewMyProducts from "./Pages/Products/ViewMyProducts.js";
import EditProduct from "./Components/Products/EditProduct.js";
import AdminProducts from "./Pages/Products/AdminProducts.js";
import AdminAllProducts from "./Pages/Products/AdminAllProducts.js";
import TouristAllProducts from "./Pages/Products/TouristAllProducts.js";
import TourGuideEditProfile from "./Pages/EditAccount/TourGuideEditAccount.js";
import GovernorDashboard from "./Pages/Dashboards/GovernorDashboard";
import AdvertiserEditProfile from "./Pages/EditAccount/AdvertiserEditAccount.js";
import SellerEditProfile from "./Pages/EditAccount/SellerEditAccount.js";
import SellerDashboard from "./Pages/Dashboards/SellerDashboard";
import TouristProducts from "./Pages/Products/TouristProducts.js";
import MyPurchases from "./Pages/Products/MyPurchases.js";
import ComplaintsDashboard from "./Components/Complaints/ComplaintDashboard.js";
import ComplaintDetails from "./Components/Complaints/ComplaintDetails.js";
import MyComplaints from "./Components/Complaints/MyComplaints.js";

import FlightsBooking from "./Pages/ThirdParty/FlightsBooking.js";
import HotelsBooking from "./Pages/ThirdParty/HotelsBooking.js";
//import TouristNavBar from "./Components/TouristNavBar.js";
import BookingDetails from "./Pages/Bookings/myBookings.js";
//import CheckoutForm from "./Pages/Payment/checkout.js";
import Completion from "./Pages/Payment/completion.js";
import Payment from "./Pages/Payment/payment2.js";
import PaymentPage from "./Pages/Payment/mailAmount.js";
//import Payment from "./Pages/Payment/payment.js";
import ViewAllItineraries from "./Pages/Admin/ViewAllItineraries.js";
import ViewAllActivities from "./Pages/Admin/ViewAllActivities.js";
import PastBookingDetails from "./Pages/Bookings/myPastBookings.js";
import GuestDashboard from "./Pages/Dashboards/GuestDashboard.js";
import Wishlist from "./Pages/Products/Wishlist.js";
import TransportationBooking from "./Pages/ThirdParty/TransportationBooking.js";
//cart page
import CartPage from "./Pages/Products/CartPage.js";
import ChangePassword from "./Pages/Admin/ChangePassword.js";
import MyOrders from "./Pages/Products/OrdersPage.js";

import CreatePromoCode from "./Pages/Admin/CreatePromoCode.js";
import MySavedItems from "./Pages/SavedItems.js";
import Orders from "./Pages/orders.js";

function App() {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          {/* <Route index element={<Hotels />} /> */}
          <Route path="/changePassword" element={<ChangePassword/>} />
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<Signup />} />
          <Route path="/createItinerary" element={<CreateItinerary />} />
          <Route path="/rudItinerary" element={<RUDItinerary />} />
          <Route
            path="/viewUpcomingItinerary"
            element={<ViewUpcomingItinerary />}
          />
          <Route path="/viewAllTourist" element={<ViewAllTourist />} />
          <Route path="/viewAllTourist/:id" element={<ViewAllTourist />} />
          <Route path="/tourGuideDashboard" element={<TourGuideDashboard />} />
          <Route path="/touristDashboard" element={<TouristDashboard />} />
          <Route
            path="/tourGuideEditAccount"
            element={<TourGuideEditProfile />}
          />
          <Route path="/guestDashboard" element={<GuestDashboard />} />
          <Route path="/governorDashboard" element={<GovernorDashboard />} />
          <Route path="/createMuseum" element={<CreateMuseum />} />
          <Route
            path="/createHistoricalPlace"
            element={<CreateHistoricalPlace />}
          />
          <Route path="/RUDMuseum" element={<RUDMuseum />} />
          <Route path="/RUDHistoricalPlace" element={<RUDHistoricalPlace />} />
          {/* <Route path="/RUDVisit" element={<RUDVisit />} /> */}
          <Route path="/MuseumTouristPov" element={<MuseumTouristPov />} />
          <Route
            path="/HistoricalPlaceTouristPov"
            element={<HistoricalPlaceTouristPov />}
          />
          <Route path="/MuseumTouristPov/:id" element={<MuseumTouristPov />} />
          <Route
            path="/HistoricalPlaceTouristPov/:id"
            element={<HistoricalPlaceTouristPov />}
          />
          <Route
            path="/UpcomingHistoricalPlaces"
            element={<UpcomingHistoricalPlaces />}
          />
          <Route path="/UpcomingMuseums" element={<UpcomingMuseums />} />
          <Route path="/createTagMuseum" element={<CreateTagMuseum />} />
          <Route
            path="/createTagHistoricalPlace"
            element={<CreateTagHistoricalPlace />}
          />

          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/pendingusers" element={<ApproveUsers />} />
          <Route path="/deleteusers" element={<DeleteUser />} />
          <Route path="/addAdmin" element={<AddAdmin />} />
          <Route path="/addGovernor" element={<AddGoverner />} />
          <Route path="/categoriesActions" element={<CategoriesActions />} />
          <Route path="/viewAllItineraries" element={<ViewAllItineraries />} />
          <Route path="/viewAllActivities" element={<ViewAllActivities />} />
          <Route path="/preferenceTags" element={<PreferenceTags />} />
          <Route path="/admin/complaints" element={<ComplaintsDashboard />} />
          <Route path="/admin/complaints" element={<ComplaintsDashboard />} />
          <Route path="/admin/complaints/:id" element={<ComplaintDetails />} />
          <Route path="/myComplaints" element={<MyComplaints />} />
          <Route path="/touristProducts" element={<TouristProducts />} />
          <Route path="/Wishlist" element={<Wishlist />} />
          <Route
            path="/advertiserDashboard"
            element={<AdvertiserDashboard />}
          />
          <Route path="/activity/addActivity" element={<AddActivity />} />
          <Route path="/activity/rudActivity" element={<RUDActivity />} />
          <Route path="/activity/upcoming" element={<UpcomingActivities />} />
          <Route
            path="/activity/searchActivities"
            element={<SearchActivities />}
          />
          <Route
            path="/activity/searchActivities/:id"
            element={<SearchActivities />}
          />
          <Route path="/activity/SortFilter" element={<SortFilterActivity />} />
          <Route path="/activity/myActivities" element={<MyActivities />} />
          <Route path="/location" element={<ClinicLocation />} />
          <Route path="/myPastBookings" element={<PastBookingDetails />} />
          <Route path="/myBookings" element={<BookingDetails />} />

          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/checkout" element={<Payment />} />
          <Route path="/completion" element={<Completion />} />

          <Route path="/ProductDashboard" element={<ProductDashboard />} />
          <Route path="/AllProducts" element={<AllProducts />} />
          <Route path="/AddProducts" element={<AddProducts />} />
          <Route path="/FilterProducts" element={<FilterProducts />} />
          <Route path="/SearchProducts" element={<SearchProducts />} />
          <Route path="/SortProducts" element={<SortProducts />} />
          <Route path="/ViewMyProducts" element={<ViewMyProducts />} />
          <Route path="/editProduct/:productId" element={<EditProduct />} />
          <Route path="/Adminproducts" element={<AdminProducts />} />
          <Route path="/AdminAllProducts" element={<AdminAllProducts />} />
          <Route path="/TouristAllProducts" element={<TouristAllProducts />} />
          <Route path="/editAccount" element={<TouristEditAccount />} />
          <Route
            path="/advertiserEditAccount"
            element={<AdvertiserEditProfile />}
          />
          <Route path="/sellerEditAccount" element={<SellerEditProfile />} />
          <Route path="/sellerDashboard" element={<SellerDashboard />} />
          <Route path="/flights" element={<FlightsBooking />} />
          <Route path="/transportation" element={<TransportationBooking />} />
          <Route path="/hotels" element={<HotelsBooking />} />
          <Route path="/myPurchases/:orderNumber" element={<MyPurchases />} />
          <Route path="/myOrders" element={<MyOrders />} />
          <Route path="/myCart" element={<CartPage />} />


          <Route path="/addPromoCode" element={<CreatePromoCode/>} />
          <Route path="/mySaved" element={<MySavedItems/>} />
          <Route path="/orders" element={<Orders/>} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
}

export default App;
