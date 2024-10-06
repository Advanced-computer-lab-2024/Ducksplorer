import React from "react";
import SortActivities from "./sortActivities";

import { Button } from "@mui/material";
import { useState } from "react";
import FilterActivities from "./filterActivities";

function SortFilterActivity() {
  const [sort, setSort] = useState(false);
  const [filter, setFilter] = useState(false);

  return (
    <div>
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
  );
}

export default SortFilterActivity;
