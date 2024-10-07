import React from "react";
import SortActivities from "./sortActivities";

import { Button } from "@mui/material";
import { useState } from "react";
import FilterActivities from "./filterActivities";
import TouristSidebar from "../Components/TouristSidebar";

function SortFilterActivity() {
  const [sort, setSort] = useState(true);
  const [filter, setFilter] = useState(false);

  return (
    <div>
      <TouristSidebar/>
      <div style={{ marginLeft: 300 }}>
        <Button
          style={{
            border: "1.3px solid black",
            borderRadius: 100,
            color: "black",
          }}
          onClick={() => {
            setSort(!sort);
            if (filter) {
              setFilter(false);
            }
          }}
        >
          {" "}
          Sort{" "}
        </Button>
        <Button
          style={{
            margin: 10,
            border: "1.3px solid black",
            borderRadius: 100,
            color: "black",
          }}
          onClick={() => {
            setFilter(!filter);
            if (sort) {
              setSort(false);
            }
          }}
        >
          filter
        </Button>
        {sort && <SortActivities />}
        {filter && <FilterActivities />}
      </div>
    </div>
  );
}

export default SortFilterActivity;
