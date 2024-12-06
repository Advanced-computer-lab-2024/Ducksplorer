import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

export default function Error404({ route, errorMessage, backMessage }) {
    const navigate = useNavigate();  // Get the navigate function

    const handleRedirect = () => {
        navigate(route);
        window.location.reload();
    };

    return (
        <div
            style={{
                width: "100%",
                height: "100vh", // Full viewport height
                display: "flex",
                justifyContent: "center", // Center horizontally
                alignItems: "center", // Center vertically
                flexDirection: "column",
                textAlign: "center", // Center text
                padding: "2rem",
                boxSizing: "border-box",
            }}
        >
            <h1
                style={{
                    fontFamily: "Inconsolata, monospace",
                    margin: "2rem",
                    textTransform: "uppercase",
                    fontSize: "3rem", // Adjusted font size
                    letterSpacing: "5px",
                    color: "#000",
                }}
            >
                404 Not Found
            </h1>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "2rem", // Space below the image
                }}
            >
                <img
                    src="DuckError404.png"
                    alt="Duck Error 404"
                    style={{
                        width: "70%", // Adjust the image size for better responsiveness
                        maxWidth: "400px", // Set a max width for better scaling
                        height: "auto",
                    }}
                />
            </div>

            <div
                style={{
                    maxWidth: "600px", // Limit the width for large screens
                    width: "100%",
                    boxSizing: "border-box",
                    marginTop: "2rem",
                }}
            >
                <h2
                    style={{
                        fontSize: "2.5rem",
                        fontWeight: "bold",
                        color: "#000",
                    }}
                >
                    I have bad news for you
                </h2>
                <p
                    style={{
                        fontFamily: '"Space Mono", monospace',
                        fontSize: "1.5rem",
                        fontWeight: 400,
                        lineHeight: 1.7,
                        color: "#000",
                        marginBottom: "2rem",
                    }}
                >
                    {errorMessage}
                </p>

                <Button
                    onClick={handleRedirect}
                    size="large"
                    variant="contained"
                    sx={{
                        padding: "1rem 2rem",
                        borderRadius: "5px",
                    }}
                    className="blackhover"
                >
                    {backMessage}
                </Button>
            </div>
        </div>
    );
}
