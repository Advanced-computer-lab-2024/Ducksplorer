import React, { useState } from "react";
import { Tabs, Tab } from "@mui/material";

const MyTabs = ({ tabNames, onTabClick , paths }) => {
    const [selectedTab, setSelectedTab] = useState(tabNames[0]);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
        onTabClick(newValue);
    };

    return (
        <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
                ".MuiTabs-indicator": { backgroundColor: "#ff9933" }, // Indicator color
            }}
        >
            {tabNames.map((tabName) => (
                <Tab
                    key={tabName}
                    label={tabName}
                    value={tabName}
                    sx={{
                        color: selectedTab === tabName ? "#ff9933" : "#000", // Tab text color
                        "&.Mui-selected": { color: "#ff9933" }, // Selected tab text color
                    }}
                />
            ))}
        </Tabs>
    );
};

export default MyTabs;
