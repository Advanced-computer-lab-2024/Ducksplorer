import React from "react";
import MuseumForm from "../../Components/MuseumHistoricalPlaceComponent/MuseumForm";
import GovernorNavBar from "../../Components/NavBars/GovernorNavBar";
import { Link } from "react-router-dom";

const CreateMuseum = () => {
  return (
    <div>
      {/* <Link to="/governorDashboard"> Back </Link> */}
      <GovernorNavBar />
      <MuseumForm />
    </div>
  );
};

export default CreateMuseum;
