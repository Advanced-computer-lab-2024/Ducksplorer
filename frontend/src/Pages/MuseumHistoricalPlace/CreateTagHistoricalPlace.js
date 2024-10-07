import React from 'react'
import HistoricalPlaceTagForm from '../../Components/MuseumHistoricalPlaceComponent/HistoricalPlaceTagForm';
import { Link } from 'react-router-dom';


const CreateTagHistoricalPlace = () => {

    return (
        <div>
            <Link to="/RUDHistoricalPlace"> Back </Link>
            <HistoricalPlaceTagForm />
        </div>
    )
}

export default CreateTagHistoricalPlace;