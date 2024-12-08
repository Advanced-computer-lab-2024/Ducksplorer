import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { message } from "antd";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import axios from "axios";
import AdminNavbar from "../../Components/NavBars/AdminNavBar"; 
import { Typography, Box } from "@mui/material";

function CreatePromoCode() {
  const [code, setCode] = useState("");
  const [value, setValue] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/admin/addPromoCode",
        {
          code,
          value,
          date,
        }
      );
      if (response.status === 200) {
        message.success("Code created successfully");
      } else {
        message.error("Failed to create code");
      }
    } catch (error) {
      message.error("An error occurred: " + error.message);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div style={styles.container}>
        <div style={styles.leftSection}>
          <Typography
            variant="h3"
            className="duckTitle"
            style={styles.welcomeText}
          >
            Promo Code
          </Typography>
        </div>
        <div style={styles.rightSection}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              backgroundColor: "#f9f9f9",
              borderRadius: "16px",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h2
              className="bigTitle"
              style={{
                textAlign: "center",
                alignSelf: "center",
                marginBottom: "5%",
                position: "relative",
                marginTop: "-20%",
              }}
            >
              Create Promo Code
            </h2>
            <form onSubmit={handleAdd} style={styles.form}>
              <Stack spacing={3} style={{ justifyContent: "center", alignContent: "center" }}>
                <TextField
                  name="code"
                  label="Code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  InputLabelProps={{ style: { color: "#777" } }}
                  InputProps={{
                    style: {
                      fontSize: "16px",
                      color: "#ff9933",
                    },
                  }}
                  sx={{
                    width: "150%",
                    margin: "auto",
                    right: "20%",
                  }}
                />

                <TextField
                  name="value"
                  label="Discount value as a percentage"
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  InputLabelProps={{ style: { color: "#777" } }}
                  InputProps={{
                    style: {
                      fontSize: "16px",
                      color: "#ff9933",
                    },
                  }}
                  sx={{
                    width: "150%",
                    margin: "auto",
                    right: "20%",
                  }}
                />

                <TextField
                  name="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  InputLabelProps={{ style: { color: "#777" } }}
                  InputProps={{
                    style: {
                      fontSize: "16px",                    },
                  }}
                  sx={{
                    width: "150%",
                    margin: "auto",
                    right: "20%",
                  }}
                />

                <Button
                 className="blackhover"
                  variant="contained"
                  type="submit"
                  sx={{
                    backgroundColor: "#ff9800",
                    color: "white",
                    fontWeight: "bold",
                    textTransform: "none",
                    borderRadius: "25px",
                    padding: "12px 24px",
                    fontSize: "16px",
                    width: "100%",
                    justifySelf: "center",
                    justifyContent: "center",
                    alignContent: "center",
                  }}
                  fullWidth
                >
                  Create Promo Code
                </Button>
              </Stack>
            </form>
          </Box>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    background: "url('/duckPromo.jpg') no-repeat center center fixed",
    backgroundSize: "cover",
  },
  leftSection: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "#fff",
    padding: "20px",
  },
  rightSection: {
    flex: 0.7,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.85)",
  },
  welcomeText: {
    fontSize: "3rem",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  form: {
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: "rgba(255,255,255,0.5)",
  },
};

export default CreatePromoCode;
