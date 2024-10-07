import * as React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import { useEffect, useState } from "react";
import axios from "axios";

function StandAloneToggleButton(props) {
  const [selected, setSelected] = React.useState(
    props.tags.includes(props.name)
  );

  let allTags = [];

  // let tags = useContext(TagsContext);

  function getTagNames(element) {
    return {
      _id: element._id,
      name: element.name,
    };
  }

  useEffect(() => {
    axios
      .get("http://localhost:8000/preferenceTags/")
      .then((response) => {
        const data = response.data;
        console.log(data);
        allTags = data.map(getTagNames);
        console.log(allTags);
        localStorage.setItem("tags", JSON.stringify(allTags));
      })
      .catch((error) => {
        console.error("There was an error fetching the categories!", error);
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
        selected={selected}
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

export default StandAloneToggleButton;