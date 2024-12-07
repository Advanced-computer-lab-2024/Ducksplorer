import React from 'react'
import HistoricalPlaceForm from '../../Components/MuseumHistoricalPlaceComponent/HistoricalPlaceForm';
import { Link } from 'react-router-dom';
import GovernorNavBar from '../../Components/NavBars/GovernorNavBar';


const CreateHistoricalPlace = () => {

    return (
        <div>
            {/* <Link to="/governorDashboard"> Back </Link> */}
            <GovernorNavBar />
            <HistoricalPlaceForm />
        </div>
    )
}

export default CreateHistoricalPlace;
