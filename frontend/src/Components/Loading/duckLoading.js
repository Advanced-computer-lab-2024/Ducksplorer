import React from "react";
import "./duckLoading.css"; // Optional CSS for styling

const DuckLoading = () => {
  return (
    <div className="duck-loading-container">
      <video
        className="duck-video"
        src="/ducks.mp4" // Replace with your video path
        autoPlay
        loop
        muted
      ></video>
      <p className="loading-text">Quack, quack... Loading!</p>
    </div>
  );
};

export default DuckLoading;
