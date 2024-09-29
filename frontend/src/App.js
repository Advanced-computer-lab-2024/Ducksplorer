import './App.css';
import React from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Signup from './Pages/Signup.js';
import AdminDashboard from './Components/AdminDashboard.js';
import ApproveUsers from './Pages/Admin/ApproveUsers.js';
import DeleteUser from './Pages/Admin/DeleteUsers.js';
import AddAdmin from './Pages/Admin/AddAdmin.js';

   

 
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
      </Routes>
    </BrowserRouter>
    </React.StrictMode>
  );
}



export default App;
