import React from "react";
import ReactDOM from "react-dom/client";
//import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import App from "./App";
import { TypeContextProvider } from "./context/TypeContext";
import { AuthContextProvider } from "./context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <TypeContextProvider>
    <AuthContextProvider>
    <App />
    </AuthContextProvider>
  </TypeContextProvider>
);
