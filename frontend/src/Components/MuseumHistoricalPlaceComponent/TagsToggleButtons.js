import * as React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import { useEffect, useState } from "react";
import axios from "axios";

function TagsToggleButtons(props) {
  const [selected, setSelected] = React.useState(props.tags.includes(props.name));

  const [allTags, setAllTags] = useState([]);

  // Fetching tags based on tagType (either "museum" or "historicalPlace")
  useEffect(() => {
    const fetchTags = async () => {
      let url = "";
      if (props.tagType === "museum") {
        url = "http://localhost:8000/museumTags/getAllMuseumTags";
      } else if (props.tagType === "historicalPlace") {
        url = "http://localhost:8000/historicalPlaceTags/getAllHistoricalPlaceTags";
      }

      try {
        const response = await axios.get(url);
        const data = response.data;

        if (props.tagType === "museum") {
          const museumTags = data.map((element) => ({
            _id: element._id,
            name: element.museumTag,
          }));
          setAllTags(museumTags);
          localStorage.setItem("MuseumTags", JSON.stringify(museumTags));
        } else if (props.tagType === "historicalPlace") {
          const historicalPlaceTags = data.map((element) => ({
            _id: element._id,
            name: element.historicalPlaceTag,
          }));
          setAllTags(historicalPlaceTags);
          localStorage.setItem("HistoricalTags", JSON.stringify(historicalPlaceTags));
        }
      } catch (error) {
        console.error("There was an error fetching the tags:", error);
      }
    };

    fetchTags();
  }, [props.tagType]);

  const handleTagChange = () => {
    setSelected(!selected);

    if (selected) {
      // Remove the tag
      const updatedTags = props.tags.filter((tag) => tag !== props.name);
      props.setTags(updatedTags); // Pass the updated tags back to the parent
    } else {
      // Add the tag
      props.setTags([...props.tags, props.name]);
    }
  };

  return (
    <div>
      <ToggleButton
        key={props.id}
        style={{
          margin: 5,
          width: 100,
          borderRadius: "2cap",
          height: 30,
          fontSize: 12,
        }}
        value=""
        selected={props.tags.includes(props.name)} // Check if tag is selected
        onChange={handleTagChange}
      >
        {props.name}
      </ToggleButton>
    </div>
  );
}

export default TagsToggleButtons;
