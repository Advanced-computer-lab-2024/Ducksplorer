import * as React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { TagsContext } from "./AddActivityForm";
import { useContext } from "react";

function StandAloneToggleButton(props) {
  const [selected, setSelected] = React.useState(false);

  //   const [tags, setTags] = useState([]);
  let allTags = [];
  let tags = useContext(TagsContext);

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
        allTags = data.map(getTagNames);
        localStorage.setItem("tags", JSON.stringify(allTags));
      })
      .catch((error) => {
        console.error("There was an error fetching the categories!", error);
      });
  }, []);

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
          tags.includes(props.name)
            ? tags.splice(tags.indexOf(props.name), 1)
            : tags.push(props.name);
          console.log(tags);
        }}
      >
        {props.name}
      </ToggleButton>
    </div>
  );
}

export default StandAloneToggleButton;
