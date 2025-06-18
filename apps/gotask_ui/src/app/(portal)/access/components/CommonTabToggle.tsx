import React from "react";
import { Box } from "@mui/material";

interface CommonTabToggleProps<T extends string> {
  tabs: T[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  getLabel?: (tab: T) => string;
}

const CommonTabToggle = <T extends string>({
  tabs,
  activeTab,
  onTabChange,
  getLabel = (tab) => tab // fallback: use tab string as label
}: CommonTabToggleProps<T>) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 4,
        position: "relative",
        borderBottom: "2px solid #eee",
        width: "fit-content",
        marginBottom: "4px"
      }}
    >
      {tabs.map((tab, index) => (
        <Box
          key={tab}
          onClick={() => onTabChange(tab)}
          sx={{
            cursor: "pointer",
            fontSize: "0.875rem",
            fontWeight: activeTab === tab ? 600 : 400,
            color: activeTab === tab ? "#741B92" : "#555",
            paddingBottom: "4px",
            transition: "color 0.2s",
            width: "50%",
            textAlign: "center"
          }}
        >
          {getLabel(tab)}
        </Box>
      ))}

      {/* Animated underline */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: `${tabs.indexOf(activeTab) * (100 / tabs.length)}%`,
          width: `${100 / tabs.length}%`,
          height: "2px",
          backgroundColor: "#741B92",
          transition: "left 0.3s ease"
        }}
      />
    </Box>
  );
};

export default CommonTabToggle;
