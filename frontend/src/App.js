import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup.js";
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
          <Route path="/signUp" element={<Signup />} />
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
