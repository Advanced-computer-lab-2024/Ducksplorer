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
import "bootstrap/dist/css/bootstrap.min.css";
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

import MySavedItems from "./Pages/SavedItems.js";
import Orders from "./Pages/Products/orders.js";
import { useAuthContext } from "./context/AuthContext.js";
import ProtectedRoute from "./Components/ProtectedRoute"; // Import the ProtectedRoute component

import CreatePromoCode from "./Pages/Admin/CreatePromoCode.js";
import MyNotifications from "./Components/myNotifications.js";
import ForgetPassword from "./Pages/EditAccount/ForgetPassword.js";

import TourGuideItineraryReport from "./Pages/Itinerary/tourGuideReport.js"
import AdvertiserActivityReport from "./Pages/Activities/advertiserReport.js"
import AdminReport from "./Pages/Admin/adminReport.js"
import UserReport from "./Pages/Admin/UsersReport.js"


import SellerProductReport from "./Pages/Products/sellerReport.js"
import EditItinerary from "./Pages/Itinerary/editItinerary.js";

import LandingPage from "./Pages/LandingPage.js";
import ActivityCard from "../src/Components/activityCard";
import FlightsPage from './Components/ThirdParty/FlightsPage';
import HotelsPage from './Components/ThirdParty/HotelsPage';

function App() {
  const { authUser } = useAuthContext();
  return (
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          {/* <Route index element={<Hotels />} /> */}
          <Route path="/notifications" element={<MyNotifications />} />
          <Route
            path="/changePassword"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          <Route path="/forgetPassword" element={<ForgetPassword />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<Signup />} />
          <Route
            path="/createItinerary"
            element={
              <ProtectedRoute>
                <CreateItinerary />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rudItinerary"
            element={
              <ProtectedRoute>
                <RUDItinerary />
              </ProtectedRoute>
            }
          />
          <Route path="/editItinerary" element={<EditItinerary />} />
          <Route
            path="/viewUpcomingItinerary"
            element={
              <ProtectedRoute allowGuest={true}>
                <ViewUpcomingItinerary />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tourGuideReport"
            element={<TourGuideItineraryReport />}
          />
          <Route path="/adminReport" element={<AdminReport />} />
          <Route path="/userReport" element={<UserReport />} />
          <Route
            path="/tourGuideReport"
            element={<TourGuideItineraryReport />}
          />
          <Route path="/adminReport" element={<AdminReport />} />
          <Route path="/userReport" element={<UserReport />} />
          <Route
            path="/viewAllTourist"
            element={
              <ProtectedRoute allowGuest={true}>
                <ViewAllTourist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/viewAllTourist/:id"
            element={
              <ProtectedRoute>
                <ViewAllTourist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tourGuideDashboard"
            element={
              <ProtectedRoute>
                <TourGuideDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/touristDashboard"
            element={
              <ProtectedRoute>
                <TouristDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tourGuideEditAccount"
            element={
              <ProtectedRoute>
                <TourGuideEditProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/guestDashboard"
            element={
              <ProtectedRoute allowGuest={true}>
                <GuestDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/governorDashboard"
            element={
              <ProtectedRoute>
                <GovernorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/createMuseum"
            element={
              <ProtectedRoute>
                <CreateMuseum />
              </ProtectedRoute>
            }
          />
          <Route
            path="/createHistoricalPlace"
            element={
              <ProtectedRoute>
                <CreateHistoricalPlace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/RUDMuseum"
            element={
              <ProtectedRoute>
                <RUDMuseum />
              </ProtectedRoute>
            }
          />
          <Route
            path="/RUDHistoricalPlace"
            element={
              <ProtectedRoute>
                <RUDHistoricalPlace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/MuseumTouristPov"
            element={
              <ProtectedRoute allowGuest={true}>
                <MuseumTouristPov />
              </ProtectedRoute>
            }
          />
          <Route
            path="/HistoricalPlaceTouristPov"
            element={
              <ProtectedRoute allowGuest={true}>
                <HistoricalPlaceTouristPov />
              </ProtectedRoute>
            }
          />
          <Route
            path="/MuseumTouristPov/:id"
            element={
              <ProtectedRoute>
                <MuseumTouristPov />
              </ProtectedRoute>
            }
          />
          <Route
            path="/HistoricalPlaceTouristPov/:id"
            element={
              <ProtectedRoute>
                <HistoricalPlaceTouristPov />
              </ProtectedRoute>
            }
          />
          <Route
            path="/UpcomingHistoricalPlaces"
            element={
              <ProtectedRoute allowGuest={true}>
                <UpcomingHistoricalPlaces />
              </ProtectedRoute>
            }
          />
          <Route
            path="/UpcomingMuseums"
            element={
              <ProtectedRoute allowGuest={true}>
                <UpcomingMuseums />
              </ProtectedRoute>
            }
          />
          <Route
            path="/createTagMuseum"
            element={
              <ProtectedRoute>
                <CreateTagMuseum />
              </ProtectedRoute>
            }
          />
          <Route
            path="/createTagHistoricalPlace"
            element={
              <ProtectedRoute>
                <CreateTagHistoricalPlace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/AdminDashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pendingusers"
            element={
              <ProtectedRoute>
                <ApproveUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/deleteusers"
            element={
              <ProtectedRoute>
                <DeleteUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addAdmin"
            element={
              <ProtectedRoute>
                <AddAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addGovernor"
            element={
              <ProtectedRoute>
                <AddGoverner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categoriesActions"
            element={
              <ProtectedRoute>
                <CategoriesActions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/viewAllItineraries"
            element={
              <ProtectedRoute>
                <ViewAllItineraries />
              </ProtectedRoute>
            }
          />
          <Route
            path="/viewAllActivities"
            element={
              <ProtectedRoute>
                <ViewAllActivities />
              </ProtectedRoute>
            }
          />
          <Route
            path="/preferenceTags"
            element={
              <ProtectedRoute>
                <PreferenceTags />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/complaints"
            element={
              <ProtectedRoute>
                <ComplaintsDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/complaints"
            element={
              <ProtectedRoute>
                <ComplaintsDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/complaints/:id"
            element={
              <ProtectedRoute>
                <ComplaintDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/myComplaints"
            element={
              <ProtectedRoute>
                <MyComplaints />
              </ProtectedRoute>
            }
          />
          <Route
            path="/touristProducts"
            element={
              <ProtectedRoute>
                <TouristProducts />
              </ProtectedRoute>
            }
          />          <Route path="/Wishlist" element={<Wishlist />} />
          <Route
            path="/advertiserDashboard"
            element={
              <ProtectedRoute>
                <AdvertiserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/activity/addActivity"
            element={
              <ProtectedRoute>
                <AddActivity />
              </ProtectedRoute>
            }
          />
          <Route
            path="/activity/rudActivity"
            element={
              <ProtectedRoute>
                <RUDActivity />
              </ProtectedRoute>
            }
          />
          <Route
            path="/activity/upcoming"
            element={
              <ProtectedRoute>
                <UpcomingActivities />
              </ProtectedRoute>
            }
          />
          <Route
            path="/activity/searchActivities"
            element={
              <ProtectedRoute allowGuest={true}>
                <SearchActivities />
              </ProtectedRoute>
            }
          />
          <Route
            path="/activity/searchActivities/:id"
            element={
              <ProtectedRoute>
                <SearchActivities />
              </ProtectedRoute>
            }
          />
          <Route
            path="/activity/SortFilter"
            element={
              <ProtectedRoute allowGuest={true}>
                <SortFilterActivity />
              </ProtectedRoute>
            }
          />
          <Route
            path="/activity/myActivities"
            element={
              <ProtectedRoute>
                <MyActivities />
              </ProtectedRoute>
            }
          />
          <Route
            path="/location"
            element={
              <ProtectedRoute>
                <ClinicLocation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/myPastBookings"
            element={
              <ProtectedRoute>
                <PastBookingDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/myBookings"
            element={
              <ProtectedRoute>
                <BookingDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/completion"
            element={
              <ProtectedRoute>
                <Completion />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ProductDashboard"
            element={
              <ProtectedRoute>
                <ProductDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/AllProducts"
            element={
              <ProtectedRoute>
                <AllProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/AddProducts"
            element={
              <ProtectedRoute>
                <AddProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/FilterProducts"
            element={
              <ProtectedRoute>
                <FilterProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/SearchProducts"
            element={
              <ProtectedRoute>
                <SearchProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/SortProducts"
            element={
              <ProtectedRoute>
                <SortProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ViewMyProducts"
            element={
              <ProtectedRoute>
                <ViewMyProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editProduct/:productId"
            element={
              <ProtectedRoute>
                <EditProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Adminproducts"
            element={
              <ProtectedRoute>
                <AdminProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/AdminAllProducts"
            element={
              <ProtectedRoute>
                <AdminAllProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/TouristAllProducts"
            element={
              <ProtectedRoute allowGuest={true}>
                <TouristAllProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editAccount"
            element={
              <ProtectedRoute>
                <TouristEditAccount />
              </ProtectedRoute>
            }
          />
          <Route
            path="/advertiserEditAccount"
            element={
              <ProtectedRoute>
                <AdvertiserEditProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/advertiserReport"
            element={
              <ProtectedRoute>
                <AdvertiserActivityReport />
              </ProtectedRoute>
            }
          />

          <Route path="/sellerReport" element={<SellerProductReport />} />
          <Route
            path="/sellerEditAccount"
            element={
              <ProtectedRoute>
                <SellerEditProfile />
              </ProtectedRoute>
            }
          />
          <Route path="/ActivityCardTest" element={<ActivityCard />} />
          <Route
            path="/sellerDashboard"
            element={
              <ProtectedRoute>
                <SellerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/flights"
            element={
              <ProtectedRoute>
                <FlightsBooking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transportation"
            element={
              <ProtectedRoute>
                <TransportationBooking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hotels"
            element={
              <ProtectedRoute>
                <HotelsBooking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/myPurchases/:orderNumber"
            element={
              <ProtectedRoute>
                <MyPurchases />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hotelsPage"
            element={
              <ProtectedRoute>
                <HotelsPage />
              </ProtectedRoute>
            }
          />

          <Route path="/addPromoCode" element={<CreatePromoCode />} />
          <Route path="/myOrders" element={<MyOrders />} />
          <Route path="/myCart" element={<CartPage />} />


          
          <Route path="/mySaved" element={<MySavedItems/>} />
          <Route path="/orders" element={<Orders/>} />
          <Route path="/flightsPage" element={<FlightsPage />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
}

export default App;
