//This is a filter component which we import inside the historicalPlaceTouristPov page
import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  IconButton,
  Menu,
  MenuItem,
  Checkbox,
  Button,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";

const HistoricalPlaceFilterComponent = ({ onFilter }) => {
  const [tags, setTags] = useState([]); // Tags selected by the user
  const [allTags, setAllTags] = useState([]); // All available tags from backend
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);

  // Fetch all tags from the backend
  useEffect(() => {
    axios
      .get(
        "http://localhost:8000/historicalPlaceTags/getAllHistoricalPlaceTags"
      )
      .then((response) => {
        setAllTags(response.data); // Assuming your backend returns an array of tag objects
      })
      .catch((error) => {
        console.error("Error fetching tags:", error);
      });
  }, []);

  //When handleFilterChoiceClick is invoked (e.g., when the user clicks the filter icon), it sets the filterAnchorEl to the filter icon button.
  // This action triggers the Menu component to open, anchored to the filter icon.
  const handleFilterChoiceClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  // Handle tag selection change
  const handleTagsChange = (event) => {
    const value = event.target.value;
    setTags(value); // Puts the selected tags inside the array of tags created fel awel
  };

  // Apply the selected filters by calling the backend
  const handleFilter = () => {
    
    // Ensure all tags are strings
    const formattedTags = tags.map((tag) => tag.toLowerCase()); // Normalizing to lower case

    axios
      .get("http://localhost:8000/historicalPlace/filterByTags", {
        params: { tags: formattedTags }, // Send formatted tags
      })
      .then((response) => {
        onFilter(response.data); // Pass filtered results to parent
        if (response.data.length > 0) {
          message.success(
            "Filtering successful! Showing filtered Historical Places."
          );
        } else {
          message.warning(
            "No Historical Places found with the selected filters."
          );
        }
      })
      .catch((error) => {
        message.error("Error applying filters! Please try again.");
        console.error("Error:", error);
      });

    handleFilterClose();
  };

  // Clear all filters
  const handleClearAllFilters = () => {
    setTags([]); // Clear selected tags

    // Fetch all Historical Places from the parent component by passing an empty filter
    axios
      .get(`http://localhost:8000/historicalPlace/getAllHistoricalPlaces`)
      .then((response) => {
        onFilter(response.data); // Pass all Historical Places to parent component
        message.success("Cleared all filters! Showing all Historical Places.");
      })
      .catch((error) => {
        console.error("Error fetching all Historical Places!", error);
        message.error(
          "Error fetching all Historical Places! Please try again."
        );
      });
  };

  

  return (
    <div>
      <IconButton onClick={handleFilterChoiceClick}>
        <FilterAltIcon sx={{ color: "black" }} />
      </IconButton>
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
      >
        <MenuItem>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
          </div>
        </MenuItem>
        <MenuItem>
          <FormControl sx={{ minWidth: 120, marginTop: 1 }}>
            <InputLabel id="tags-select-label">Tags</InputLabel>
            <Select
              labelId="tags-select-label"
              id="tags-select"
              multiple
              value={tags} // Ensure it's an array
              onChange={handleTagsChange}
              renderValue={(selected) => selected.join(", ")} // Display selected tags
            >
              {allTags.map((tag) => (
                <MenuItem key={tag._id} value={tag.historicalPlaceTag}>
                  <Checkbox
                    checked={tags.indexOf(tag.historicalPlaceTag) > -1}
                  />
                  {tag.historicalPlaceTag}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </MenuItem>

        <MenuItem>
          <Button className="blackhover" sx={{color:'white'}} onClick={handleFilter}>Apply Filters</Button>
        </MenuItem>
        <MenuItem>
          <Button className="blackhover" sx={{color:'white'}} onClick={handleClearAllFilters}>Clear All Filters</Button>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default HistoricalPlaceFilterComponent;
