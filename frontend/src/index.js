import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import App from "./App";
import { TypeContextProvider } from "./context/TypeContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <TypeContextProvider>
    <App />
  </TypeContextProvider>
);
