import * as React from "react";
import { useEffect, useState } from "react";
import { Select, Option, Input, FormControl } from "@mui/joy";
import { selectClasses } from "@mui/joy/Select";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import axios from "axios";

export default function CategoriesDropDown({ onCategorySelect }) {
  const [category, setCategory] = useState(""); // Track the selected category
  const [categoryNames, setCategoryNames] = useState([]);

  const selectCategory = (category) => {
    setCategory(category); // Update the selected category directly
    if (onCategorySelect) {
      onCategorySelect(category); // Pass the selected category to the parent component
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:8000/adminActivity/all") // Fetch categories from the API
      .then((response) => {
        const categories = response.data;
        setCategoryNames(categories.map((element) => ({
          _id: element._id,
          name: element.name,
        }))); // Update the category names in state
      })
      .catch((error) => {
        console.error("There was an error fetching the categories!", error);
      });
  }, []); // Fetch categories once when the component mounts

  return (
    <FormControl sx={{ width: "100%" }}>
      <Select
        indicator={<KeyboardArrowDown />}
        color="grey"
        placeholder="Category"
        value={category} // Bind the selected category to the value
        onChange={(e, newValue) => {
          setCategory(newValue);
          selectCategory(newValue); // Update parent component on category change
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
  );
}
