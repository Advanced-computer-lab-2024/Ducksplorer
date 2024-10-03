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


   

 
function App() {

  return (
    <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path = "/signUp" element=  {<Signup/>} />  
        <Route path ="/AdminDashboard" element = {<AdminDashboard/>} />
        <Route path ="/pendingusers" element ={<ApproveUsers />} />
        <Route path ="/deleteusers" element = {<DeleteUser />} />
        <Route path ="/addAdmin" element = {<AddAdmin />} />
        <Route path ="/addGovernor" element= {<AddGoverner/>} />
        <Route path="/categoriesActions" element={<CategoriesActions />} />
        <Route path="/preferenceTags" element={<PreferenceTags />} />
      </Routes>
    </BrowserRouter>
    </React.StrictMode>
  );
}



export default App;
