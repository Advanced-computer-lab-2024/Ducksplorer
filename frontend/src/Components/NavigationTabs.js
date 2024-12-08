import React, { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const NavigationTabs = ({ tabNames, paths }) => {
    const [selectedTab, setSelectedTab] = useState(0);
    const navigate = useNavigate();
    const location = useLocation(); // Get the current path

    // Sync the selectedTab with the current route
    useEffect(() => {
        const currentTabIndex = paths.indexOf(location.pathname);
        if (currentTabIndex !== -1 && currentTabIndex !== selectedTab) {
            setSelectedTab(currentTabIndex);
        }
    }, [location.pathname, paths, selectedTab]);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
        navigate(paths[newValue]);
    };

    return (
        <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            centered
            sx={{
                marginBottom: "20px",
                "& .MuiTabs-indicator": { backgroundColor: "#ff9933" }, // Indicator color
            }}
        >
            {tabNames.map((name, index) => (
                <Tab
                    key={name}
                    label={name}
                    sx={{
                        color: selectedTab === index ? "#ff9933" : "#000", // Text color for selected/unselected tabs
                        "&.Mui-selected": { color: "#ff9933" }, // Selected tab color
                    }}
                />
            ))}
        </Tabs>
    );
};

export default NavigationTabs;
