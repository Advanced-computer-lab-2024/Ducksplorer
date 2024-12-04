import React, { useState } from "react";
import { Chip } from "@mui/material";

const MyChips = ({ chipNames, onChipClick }) => {
  const [selectedChip, setSelectedChip] = useState("All");

  const handleChipClick = (chipName) => {
    setSelectedChip(chipName);
    onChipClick(chipName);
  };

  return (
    <div>
      {chipNames.map((chipName) => (
        <Chip
          key={chipName}
          label={chipName}
          clickable
          sx={{ margin: "10px" }}
          variant={selectedChip === chipName ? "filled" : "outlined"}
          onClick={() => handleChipClick(chipName)}
        />
      ))}
    </div>
  );
};

export default MyChips;
