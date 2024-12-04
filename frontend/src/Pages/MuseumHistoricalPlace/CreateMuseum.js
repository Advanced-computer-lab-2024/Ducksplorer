import React from "react";
import MuseumForm from "../../Components/MuseumHistoricalPlaceComponent/MuseumForm";
import { Link } from "react-router-dom";

const CreateMuseum = () => {
  return (
    <div>
      <Link to="/governorDashboard"> Back </Link>
      <MuseumForm />
    </div>
  );
};

export default CreateMuseum;
