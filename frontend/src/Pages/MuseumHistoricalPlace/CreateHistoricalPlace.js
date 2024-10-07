import React from 'react'
import HistoricalPlaceForm from '../../Components/MuseumHistoricalPlaceComponent/HistoricalPlaceForm';
import { Link } from 'react-router-dom';


const CreateHistoricalPlace = () => {

    return (
        <div>
            <Link to="/governorDashboard"> Back </Link>
            <HistoricalPlaceForm />
        </div>
    )
}

export default CreateHistoricalPlace;
