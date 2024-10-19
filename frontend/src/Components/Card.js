import * as React from 'react';
// import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
// import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import ShareIcon from '@mui/icons-material/Share';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PaymentIcon from '@mui/icons-material/Payment';
import StarIcon from '@mui/icons-material/Star';
import PersonIcon from '@mui/icons-material/Person';
import { Button , Box } from '@mui/material';
import axios from 'axios';

// const ExpandMore = styled((props) => {
//   const { expand, ...other } = props;
//   return <IconButton {...other} />;
// })(({ theme }) => ({
//   marginLeft: 'auto',
//   transition: theme.transitions.create('transform', {
//     duration: theme.transitions.duration.shortest,
//   }),
//   variants: [
//     {
//       props: ({ expand }) => !expand,
//       style: {
//         transform: 'rotate(0deg)',
//       },
//     },
//     {
//       props: ({ expand }) => !!expand,
//       style: {
//         transform: 'rotate(180deg)',
//       },
//     },
//   ],
// }));

export default function Cards(props) {
  //const [expanded, setExpanded] = React.useState(false);

//   const handleExpandClick = () => {
//     setExpanded(!expanded);
//   };
 const handleBooking = () => {
//     axios.post(url, {
//       // booking data, e.g. user ID, activity ID, etc.
//     })
//     .then((response) => {
//       console.log(response);
//       // handle successful booking
//     })
//     .catch((error) => {
//       console.error(error);
//       // handle booking error
//     });
  console.log("booking");
   };

  return (
    <Card sx={{ width: 380 , borderRadius: 5 , height: 380 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <CardHeader style={{height: 60}}
        avatar={
          <Avatar sx={{ bgcolor: red[500] , width: 40, height: 40}} aria-label="recipe">
            NR
          </Avatar>
        }
        title="Nile Ritz"
        subheader="September 14, 2016"
      />
      <CardMedia style={{height: 120 ,padding: '16px'  }}
        component="img"
        height="194"
        image="hotel1.jpg"
        alt="Paella dish"
      />
      <CardContent style={{height: 100}}>
        <Typography variant="body2" sx={{ color: 'text.secondary' , fontSize: 14}}>
          This impressive paella is a perfect party dish and a fun meal to cook
          together with your guests. Add 1 cup of frozen peas along with the mussels,
          if you like.
        </Typography>
      </CardContent>
      <div style={{display:"flex", justifyContent:"center" }}>
        <IconButton aria-label="rating" sx={{ fontSize: 15 }}>
        <StarIcon /> 4.5
        </IconButton>
        <IconButton aria-label="person" sx={{ fontSize: 15 }}>
        <PersonIcon /> 2  
        </IconButton>
        <IconButton aria-label="booking" sx={{ fontSize: 15 }} onClick={handleBooking}>
        <PaymentIcon /> $9 USD
        </IconButton>
        </div>
      <CardActions disableSpacing style={{display:"flex", justifyContent:"center"}}>

     <Button variant="contained" color="primary" onClick={handleBooking}>
        Book
    </Button>
      </CardActions>
      </Box>
    </Card>
  );
}