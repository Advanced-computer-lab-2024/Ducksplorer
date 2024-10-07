import React from 'react'
import MuseumTagForm from '../../Components/MuseumHistoricalPlaceComponent/MuseumTagForm';
import { Link } from 'react-router-dom';


const CreateTagMuseum = () => {

    return (
        <div>
            <Link to="/RUDMuseum"> Back </Link>
            <MuseumTagForm />
        </div>
    )
}

export default CreateTagMuseum;