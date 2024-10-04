import './App.css';
import React from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Signup from './Pages/Signup.js';
import AdminDashboard from './Components/AdminDashboard.js';
import ApproveUsers from './Pages/Admin/ApproveUsers.js';
import DeleteUser from './Pages/Admin/DeleteUsers.js';
import AddAdmin from './Pages/Admin/AddAdmin.js';
import AddGoverner from './Pages/Admin/AddGovernor.js';
import CategoriesActions from './Pages/Admin/CategoriesActions.js';
import PreferenceTags from './Pages/Admin/PreferenceTags.js';
import Login from './Pages/Login.js';
import AddActivity from "./pages/AddActivity.js";
import RUDActivity from "./pages/RUDActivity.js";
import UpcomingActivities from "./pages/upcomingActivities.js";
import SortActivities from "./pages/sortActivities.js";
import FilterActivities from "./pages/filterActivities.js";



   

 
function App() {

  return (
    <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path ="/login" element={<Login/>} />
        <Route path = "/signUp" element=  {<Signup/>} />  
        <Route path ="/AdminDashboard" element = {<AdminDashboard/>} />
        <Route path ="/pendingusers" element ={<ApproveUsers />} />
        <Route path ="/deleteusers" element = {<DeleteUser />} />
        <Route path ="/addAdmin" element = {<AddAdmin />} />
        <Route path ="/addGovernor" element= {<AddGoverner/>} />
        <Route path="/categoriesActions" element={<CategoriesActions />} />
        <Route path="/preferenceTags" element={<PreferenceTags />} />
        <Route path="/activity" element={<AddActivity />} />
          <Route path="/rudActivity" element={<RUDActivity />} />
          <Route path="/upcoming" element={<UpcomingActivities />} />
          <Route path="/sorting" element={<SortActivities />} />
          <Route path="/filter" element={<FilterActivities />} />
        </Routes>
    </BrowserRouter>
    </React.StrictMode>
    
      
    
  );
}



export default App;
