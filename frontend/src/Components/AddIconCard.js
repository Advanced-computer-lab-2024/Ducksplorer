import React from "react";
import Card from "@mui/joy/Card";
import IconButton from "@mui/joy/IconButton";
import AddIcon from "@mui/icons-material/Add";
import { Tooltip, Box } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const AddIconCard = () => {
  const navigate = useNavigate(); // Initialize navigate hook

  const handleAddProduct = () =>{
    navigate("/AddProducts");
  };
  return (
    <Card
      variant="outlined"
      sx={{
        width: "100%",
        minWidth: "300px",
        minHeight: "375px",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        backgroundColor: "#ffffff", // Light gray background
        "&:hover": {
          backgroundColor: "#e0e0e0", // Darker gray on hover
          transform: "scale(1.05)", // Hover animation
          transition: "all 0.3s ease",
        },
      }}
      onClick={handleAddProduct} // Optional click handler
    >
      <Tooltip title="Add New">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            backgroundColor: "#ff9933", // Same theme color as your buttons
            color: "#ffffffff",
            // boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          <IconButton
            sx={{
              color: "white",
              fontSize: "3rem",
            }}
          >
            <AddIcon fontSize="large" />
          </IconButton>
        </Box>
      </Tooltip>
    </Card>
  );
};

export default AddIconCard;
