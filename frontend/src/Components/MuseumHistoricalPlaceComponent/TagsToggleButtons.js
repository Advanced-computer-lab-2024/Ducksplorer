import * as React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import { useEffect } from "react";
import axios from "axios";

function TagsToggleButtons(props) {
  const [selected, setSelected] = React.useState(
    props.tags.includes(props.name)
  );

  let allTags = [];

  // let tags = useContext(TagsContext);

  function getHistoricalPlaceTagNames(element) {
    return {
      _id: element._id,
      name: element.historicalPlaceTag,
    };
  }

  useEffect(() => {
    axios
      .get("http://localhost:8000/historicalPlaceTags/getAllHistoricalPlaceTags")
      .then((response) => {
        const data = response.data;
        allTags = data.map(getHistoricalPlaceTagNames);
        localStorage.setItem("MuseumTags", JSON.stringify(allTags));
      })
      .catch((error) => {
        console.error("There was an error fetching the Museum Tags!", error);
      });
  });

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
        selected={props.tags.includes(props.name)}
        onChange={() => {
          setSelected(!selected);
          props.tags.includes(props.name)
            ? props.tags.splice(props.tags.indexOf(props.name), 1)
            : props.tags.push(props.name);
          console.log(props.tags);
        }}
      >
        {props.name}
      </ToggleButton>
    </div>
  );
}

export default TagsToggleButtons;