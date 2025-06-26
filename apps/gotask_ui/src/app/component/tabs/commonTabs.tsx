"use client";

import React from "react";
import { Tabs, Tab } from "@mui/material";

export interface TabConfig {
  label: string;
  value: number;
}

interface CommonTabsProps {
  tabIndex: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
  tabs: TabConfig[];
  centered?: boolean;
}

const CommonTabs: React.FC<CommonTabsProps> = ({ tabIndex, onChange, tabs, centered = true }) => {
  return (
    <Tabs value={tabIndex} onChange={onChange} centered={centered}>
      {tabs.map((tab, index) => (
        <Tab key={index} label={tab.label} value={tab.value} />
      ))}
    </Tabs>
  );
};

export default CommonTabs;
