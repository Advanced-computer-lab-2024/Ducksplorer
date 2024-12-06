import * as React from "react";
// import AspectRatio from "@mui/joy/AspectRatio";
// import Card from "@mui/joy/Card";
// import CardContent from "@mui/joy/CardContent";
// import Typography from "@mui/joy/Typography";
// import Chip from "@mui/joy/Chip";
// import { Rating } from "@mui/material";
// import StarIcon from "@mui/icons-material/Star";
// import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

export default function Error404({ route, message }) {

    const navigate = useNavigate();  // Get the navigate function

    const handleRedirect = () => {
        navigate(route);
    };

    return (
        <div variant="outlined" sx={{ width: "100%", height: "auto" }}>
            <h1
                style={{
                    fontFamily: "Inconsolata, monospace",
                    marginTop: "4rem",
                    marginLeft: "7.7rem",
                    textTransform: "uppercase",
                }}
            >
                404 Not Found
            </h1>

            <div style={{ margin: '1rem', padding: '1rem' }}>
                <img src="DuckError404.png" alt="Duck Error 404" style={{ width: '100%', height: 'auto' }} />
            </div>

            <div
                style={{
                    marginTop: '10rem',
                    marginLeft: '5rem',
                    marginRight: '5rem',
                    marginBottom: '5rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(32.5rem, 1fr))',
                }}
            >
                <div
                    style={{
                        marginLeft: '5rem',
                    }}
                >
                    <h2
                        style={{
                            fontSize: '6rem',
                            lineHeight: 1.2,
                            '@media (max-width: 768px)': {
                                fontSize: '4.8rem',
                            },
                        }}
                    >
                        I have bad news for you
                    </h2>
                    <p
                        style={{
                            marginTop: '1.5rem',
                            fontFamily: '"Space Mono", monospace',
                            fontSize: '2rem',
                            fontWeight: 400,
                            lineHeight: 1.7,
                            width: '40rem',
                            '@media (max-width: 768px)': {
                                fontSize: '1.5rem',
                            },
                        }}
                    >
                        {message}
                    </p>
                    <Button
                        onClick={handleRedirect}
                        style={{
                            backgroundColor: '#ff9933',
                            color: 'white',
                            padding: '1rem 2rem',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        Back to homepage
                    </Button>
                </div>
            </div>

        </div >
    );
}
