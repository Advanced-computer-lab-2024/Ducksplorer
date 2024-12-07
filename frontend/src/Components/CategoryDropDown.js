import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

export default function CategoriesDropDown() {
  const [category, setCategory] = useState("Category");
  const [categoryNames, setCategoryNames] = useState([]);

  const selectCategory = (category, popupState) => {
    setCategory(category);
    popupState.close();
  };

  function getCategoryNames(element) {
    return {
      _id: element._id,
      name: element.name,
    };
  }

  useEffect(() => {
    axios
      .get("http://localhost:8000/adminActivity/all")
      .then((response) => {
        const categories = response.data;
        setCategoryNames(categories.map(getCategoryNames));
      })
      .catch((error) => {
        console.error("There was an error fetching the categories!", error);
      });
  }, []);
  // Additional state variables for conditional fields

  return (
    <PopupState variant="popover" popupId="demo-popup-menu">
      {(popupState) => (
        <>
          <Button
            style={{ marginBottom: "10px", backgroundColor : "orange" , alignself : "center" , width : "100%" }}
            variant="contained"
            {...bindTrigger(popupState)}
          >
            {category}
          </Button>
          <Menu {...bindMenu(popupState)}>
            {categoryNames.map((element) => {
              return (
                <MenuItem
                  key={element._id}
                  onClick={() => {
                    selectCategory(`${element.name}`, popupState);
                    console.log(element.name);
                    localStorage.setItem("category", element.name);
                  }}
                >
                  {element.name}
                </MenuItem>
              );
            })}
          </Menu>
        </>
      )}
    </PopupState>
  );
}
