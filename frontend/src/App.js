import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddActivity from "../src/pages/AddActivity.js";

function App() {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/signUp" element={<Signup />} /> */}
          <Route path="/activity" element={<AddActivity />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
}

export default App;
