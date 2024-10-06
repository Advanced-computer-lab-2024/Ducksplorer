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
          <Route path="/activity/search" element={<SearchActivities />} />
          <Route path="/activity/SortFilter" element={<SortFilterActivity />} />
          <Route path="/activity/myActivities" element={<MyActivities userName = {JSON.parse(localStorage.getItem('user')).username}/>} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
}

export default App;
