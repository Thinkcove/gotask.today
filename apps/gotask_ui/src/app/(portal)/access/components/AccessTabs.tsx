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
  const tabValue = modules.includes(currentModule) ? currentModule : modules[0];

  return (
    <Tabs
      value={tabValue}
      onChange={(e, newValue) => onChange(newValue)}
      variant="scrollable"
      scrollButtons="auto"
      sx={{
        width: '100%',
        '& .MuiTab-root': {
          minHeight: '30px',
          padding: { xs: '6px 12px', sm: '8px 16px' },
          fontSize: { xs: '0.7rem', sm: '0.85rem' },
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
