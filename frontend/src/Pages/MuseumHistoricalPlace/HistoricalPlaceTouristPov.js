// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { message } from 'antd';


// import {
//     Box,
//     Button,
//     Table,
//     Typography,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Paper
// } from '@mui/material';

// const HistoricalPlaceTouristPov = () => {
//     const [historicalPlaces, setHistoricalPlaces] = useState([]);


//     useEffect(() => {

//         axios.get(`http://localhost:8000/historicalPlace/getAllHistoricalPlaces`)
//             .then(response => {
//                 setHistoricalPlaces(response.data);
//             })
//             .catch(error => {
//                 console.error('There was an error fetching the historical places!', error);
//                 message.error('Error fetching historical places!');

//             });
//     }, []);

//     // Function to fetch upcoming historical place visits
//     const fetchUpcomingHistoricalPlaces = () => {
//         axios.get(`http://localhost:8000/historicalPlace/getAllUpcomingHistoricalPlaces`)
//             .then(response => {
//                 setHistoricalPlaces(response.data.upcomingHistoricalPlaces);  // Update state with upcoming places
//                 message.success('Upcoming historical place vists fetched successfully!');
//             })
//             .catch(error => {
//                 console.error('There was an error fetching the upcoming historical place visits!', error);
//                 message.error('Error fetching upcoming historical place visits!');
//             });
//     };



//     return (
//         <>
//             <Box sx={{ p: 6, maxWidth: 1200, overflowY: 'auto', height: '100vh' }}>

//                 <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
//                     <Typography variant="h4">Available Historical Place Visits</Typography>
//                 </Box>

//                 {/* Button to fetch upcoming historical places */}
//                 <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
//                     <Button variant="contained" color="primary" onClick={fetchUpcomingHistoricalPlaces}>
//                         Get Upcoming Historical Place Visits
//                     </Button>
//                 </Box>

//                 <TableContainer component={Paper}>
//                     <Table>
//                         <TableHead>
//                             <TableRow>
//                                 <TableCell>Description</TableCell>
//                                 <TableCell>Location</TableCell>
//                                 <TableCell>Pictures</TableCell>
//                                 <TableCell>Ticket Price</TableCell>
//                                 <TableCell>Opening Time</TableCell>
//                                 <TableCell>Closing Time</TableCell>
//                                 <TableCell>Date</TableCell>
//                                 <TableCell>Name</TableCell>
//                                 <TableCell>Category</TableCell>
//                                 <TableCell>Tags</TableCell>
//                                 <TableCell>Created By</TableCell>
//                             </TableRow>
//                         </TableHead>

//                         <TableBody>
//                             {historicalPlaces.map(historicalPlace => (
//                                 <TableRow key={historicalPlace._id}>
//                                     <TableCell>{historicalPlace.description}</TableCell>
//                                     <TableCell>{historicalPlace.location}</TableCell>
//                                     <TableCell>
//                                         <img
//                                             src={historicalPlace.pictures}
//                                             alt="Historical Place"
//                                             style={{ width: '100px', height: 'auto', objectFit: 'cover' }} // Adjust as needed
//                                         />
//                                     </TableCell>
//                                     <TableCell>{historicalPlace.ticketPrices}</TableCell>
//                                     <TableCell>{historicalPlace.openingTime}</TableCell>
//                                     <TableCell>{historicalPlace.closingTime}</TableCell>
//                                     <TableCell>{historicalPlace.HistoricalPlaceDate}</TableCell>
//                                     <TableCell>{historicalPlace.HistoricalPlaceName}</TableCell>
//                                     <TableCell>{historicalPlace.HistoricalPlaceCategory}</TableCell>
//                                     <TableCell>{historicalPlace.tags.join(', ')}</TableCell>
//                                     <TableCell>{historicalPlace.createdBy}</TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>

//             </Box>
//         </>
//     );
// };

// export default HistoricalPlaceTouristPov;


// HistoricalPlaceTouristPov.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Button,
  Table,
  Typography,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';

const HistoricalPlaceTouristPov = () => {
  const [historicalPlaces, setHistoricalPlaces] = useState([]);
  const navigate = useNavigate();

  // Fetch all historical places on component mount
  useEffect(() => {
    axios.get(`http://localhost:8000/historicalPlace/getAllHistoricalPlaces`)
      .then(response => {
        setHistoricalPlaces(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the historical places!', error);
        message.error('Error fetching historical places!');
      });
  }, []);

  // Navigate to the upcoming historical places page
  const goToUpcomingPage = () => {
    navigate('/UpcomingHistoricalPlaces');
  };

  return (
    <>
      <Box sx={{ p: 6, maxWidth: 1200, overflowY: 'auto', height: '100vh' }}>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Typography variant="h4">Available Historical Place Visits</Typography>
        </Box>

        {/* Button to navigate to upcoming historical places */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Button variant="contained" color="primary" onClick={goToUpcomingPage}>
            Get Upcoming Historical Place Visits
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Pictures</TableCell>
                <TableCell>Ticket Price</TableCell>
                <TableCell>Opening Time</TableCell>
                <TableCell>Closing Time</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Created By</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {historicalPlaces.map(historicalPlace => (
                <TableRow key={historicalPlace._id}>
                  <TableCell>{historicalPlace.description}</TableCell>
                  <TableCell>{historicalPlace.location}</TableCell>
                  <TableCell>
                    <img
                      src={historicalPlace.pictures}
                      alt="Historical Place"
                      style={{ width: '100px', height: 'auto', objectFit: 'cover' }} // Adjust as needed
                    />
                  </TableCell>
                  <TableCell>{historicalPlace.ticketPrices}</TableCell>
                  <TableCell>{historicalPlace.openingTime}</TableCell>
                  <TableCell>{historicalPlace.closingTime}</TableCell>
                  <TableCell>{historicalPlace.HistoricalPlaceDate}</TableCell>
                  <TableCell>{historicalPlace.HistoricalPlaceName}</TableCell>
                  <TableCell>{historicalPlace.HistoricalPlaceCategory}</TableCell>
                  <TableCell>{historicalPlace.tags.join(', ')}</TableCell>
                  <TableCell>{historicalPlace.createdBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default HistoricalPlaceTouristPov;
