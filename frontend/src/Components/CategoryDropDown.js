import * as React from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { useEffect, useState } from "react";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Input from "@mui/joy/Input";
import { selectClasses } from "@mui/joy/Select";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import{FormControl,Menu} from "@mui/material"
import axios from "axios";

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

  return (
    <PopupState variant="popover" style={{color:"yellow"}}popupId="demo-popup-menu">
      {(popupState) => (
        <>
          {/* Replaced Button with TextField */}
          <FormControl sx={{ width: "100%" }}>
            <Select
              indicator={<KeyboardArrowDown />}
              color="grey"
              placeholder="Category"
              onChange={(e, newValue) => {
                setCategory(newValue);
              }}
              sx={{
                width: "100%",
                [`& .${selectClasses.indicator}`]: {
                  transition: "0.2s",
                  [`&.${selectClasses.expanded}`]: {
                    transform: "rotate(-180deg)",
                  },
                },
              }}
            >
              {categoryNames.map((cat) => (
                <Option key={cat._id} value={cat.name}>
                  {cat.name}
                </Option>
              ))}
            </Select>
          </FormControl>
          <Menu {...bindMenu(popupState)}>
            {categoryNames.map((element) => (
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
            ))}
          </Menu>
        </>
      )}
    </PopupState>
  );
}
