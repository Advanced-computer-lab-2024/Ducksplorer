import React, { useEffect } from "react";
import HistoricalPlaceTagForm from "../../Components/MuseumHistoricalPlaceComponent/HistoricalPlaceTagForm";
import GovernorNavBar from "../../Components/NavBars/GovernorNavBar";

const CreateTagHistoricalPlace = () => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div style={styles.container}>
      <GovernorNavBar />
      <div style={styles.leftSection}>
        <h3 className="duckTitle" style={styles.welcomeText}>Historical Place Tags</h3>
      </div>
      <div style={styles.rightSection}>
        <HistoricalPlaceTagForm />
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    background: "url('/duckTags.jpg') no-repeat center center fixed",
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
  descriptionText: {
    fontSize: "1.5rem",
    textAlign: "center",
  },
};

export default CreateTagHistoricalPlace;
