import React from 'react';
import { Button } from '@mui/material';
import axios from 'axios';
import { message } from "antd";

const DownloadButton = ({ fileUrl, label }) => {
  const handleDownload = async () => {
    if (!fileUrl) {
      message.error('No file found for download');
      console.error('No file URL provided for download');
      return;
    }

    try {
      // Fetch the file as a blob
      const response = await axios.get(fileUrl, { responseType: 'blob' });
      
      // Create a Blob object from the response data
      const blob = new Blob([response.data], { type: response.data.type });
      
      // Create a download URL for the blob
      const downloadUrl = window.URL.createObjectURL(blob);
      
      // Create a link element
      const link = document.createElement('a');
      link.href = downloadUrl;

      // Set a default filename (optional)
      link.setAttribute('download', fileUrl.split('/').pop()); // Or customize filename
      
      // Trigger the download by clicking the link
      document.body.appendChild(link);
      link.click();
      message.success('File downloaded successfully');
      // Remove the link after triggering the download
      document.body.removeChild(link);

    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <Button variant="contained" onClick={handleDownload}>
      {label}
    </Button>
  );
};

export default DownloadButton;

