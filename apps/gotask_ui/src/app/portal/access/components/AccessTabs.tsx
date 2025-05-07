'use client';
import React from 'react';
import { Tabs, Tab } from '@mui/material';

interface AccessTabsProps {
  modules: string[];
  currentModule: string;
  onChange: (newModule: string) => void;
}

const AccessTabs: React.FC<AccessTabsProps> = ({
  modules,
  currentModule,
  onChange,
}) => {
  return (
    <Tabs
      value={currentModule}
      onChange={(e, newValue) => onChange(newValue)}
      variant="scrollable"
      scrollButtons="auto"
      sx={{
        width: '100%', // Ensures the tabs take up full width
        '& .MuiTab-root': {
          minHeight: '30px',
          padding: { xs: '6px 12px', sm: '8px 16px' }, // Responsive padding
          fontSize: { xs: '0.7rem', sm: '0.85rem' }, // Adjust font size for small screens
          textTransform: 'none',
          whiteSpace: 'nowrap',
        },
        '& .Mui-selected': {
          fontWeight: 600,
          backgroundColor: '#f3f4f6',
          borderRadius: '6px',
        },
      }}
    >
      {modules.map((module) => (
        <Tab key={module} label={module} value={module} />
      ))}
    </Tabs>
  );
};

export default AccessTabs;
