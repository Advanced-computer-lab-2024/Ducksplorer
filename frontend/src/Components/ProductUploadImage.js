import React from "react";
import { useState } from "react";
import axios from "axios";
import { message } from "antd";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function UploadFile({ onUpload }) {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  function uploadSingleImage(base64) {
    setLoading(true);
    axios
      .post("http://localhost:8000/uploadImage", { image: base64 })
      .then((res) => {
        setUrl(res.data);
        onUpload(res.data);
        message.success("Image uploaded Succesfully");
      })
      .then(() => setLoading(false))
      .catch(console.log);
  }

  function uploadMultipleImages(images) {
    setLoading(true);
    axios
      .post("http://localhost:8000/uploadMultipleImages", { images })
      .then((res) => {
        setUrl(res.data);
        onUpload(res.data);
        message.success("Image uploaded Succesfully");
      })
      .then(() => setLoading(false))
      .catch(console.log);
  }

  const uploadImage = async (event) => {
    const files = event.target.files;
    console.log(files.length);

    if (files.length === 1) {
      const base64 = await convertBase64(files[0]);
      uploadSingleImage(base64);
      return;
    }

    const base64s = [];
    for (var i = 0; i < files.length; i++) {
      var base = await convertBase64(files[i]);
      base64s.push(base);
    }
    uploadMultipleImages(base64s);
  };

  function UploadInput() {
    return (
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="dropzone-file"
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
          className="flex flex-col items-center justify-center w-full h-10 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div
            className="flex flex-col items-center justify-center pt-5 pb-6"
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop product image
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            onChange={uploadImage}
            multiple
          />
        </label>
      </div>
    );
  }

  return (
    <div className="flex justify-center flex-col m-8 ">
      <div>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh", // Full screen height
            }}
          >
            <CircularProgress size={60} thickness={4} />
            <Typography sx={{ mt: 2 }} variant="h6" color="text.secondary">
              Loading image...
            </Typography>
          </Box>
        ) : (
          <UploadInput />
        )}
      </div>
    </div>
  );
}
