import React, { useState } from "react";
import Button from "@mui/material/Button";
import { message } from "antd";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import axios from "axios";
import Sidebar from "../../Components/Sidebars/Sidebar.js";

function CreatePromoCode() {
  const [code, setCode] = useState("");
  const [value, setValue] = useState("");

  const handleAdd = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/admin/addPromoCode",
        {
          code,
          value
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
      <Sidebar />
      <div style={{ height: "80vh", transform: "translateX(125px)" }}>
        <div className="text-center">
          <h4
            className="mt-1 mb-5 pb-1"
            style={{
              color: "orange",
              textAlign: "center",
              fontSize: "24px",
              fontWeight: "bold",
              textShadow: "2px 2px 4px #aaa",
            }}
          >
            Create Promo Code
          </h4>
          <img
            src="logo1.png"
            style={{
              width: "300px",
              height: "200px",
              justifyContent: "center",
            }}
            alt="logo"
          />
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Stack spacing={3}>
            <TextField
              name="code"
              label="Code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />

            <TextField
              name="value"
              label="Discount value as a percentage"
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />

            <Button
              variant="contained"
              onClick={handleAdd}
              style={{
                width: "300px",
                backgroundColor: "orange",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "10px 20px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              Create Promo Code
            </Button>
          </Stack>
        </div>
      </div>
    </>
  );
}

export default CreatePromoCode;
