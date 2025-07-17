"use client";

import React from "react";
import { Tabs, Tab, TabsProps } from "@mui/material";

export interface TabConfig {
  label: string;
  value: number;
}

interface CommonTabsProps extends Partial<TabsProps> {
  tabIndex: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
  tabs: TabConfig[];
  centered?: boolean;
}

const CommonTabs: React.FC<CommonTabsProps> = ({
  tabIndex,
  onChange,
  tabs,
  centered = true,
  ...rest
}) => {
  return (
    <Tabs
      value={tabIndex}
      onChange={onChange}
      centered={centered}
      {...rest}
      sx={{
        ...rest.sx,
        "& .MuiTab-root": {
          textTransform: "none", 
          justifyContent: "flex-start", 
          alignItems: "flex-start",
          minHeight: "auto",
          padding: "8px 16px"
        }
      }}
    >
      {tabs.map((tab, index) => (
        <Tab key={index} label={tab.label} value={tab.value} />
      ))}
    </Tabs>
  );
};

export default CommonTabs;
