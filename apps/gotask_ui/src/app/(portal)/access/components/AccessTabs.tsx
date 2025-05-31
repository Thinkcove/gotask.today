import React from 'react';
import { Tabs, Tab } from '@mui/material';

interface AccessTabsProps {
  modules: string[];
  currentModule: string;
  onChange: (module: string) => void;
}

const AccessTabs: React.FC<AccessTabsProps> = ({ modules, currentModule, onChange }) => {
  // Fallback to first module if currentModule is invalid
  const validModule = modules.includes(currentModule) ? currentModule : modules[0] || '';

  return (
    <Tabs
      value={validModule}
      onChange={(e, newValue) => onChange(newValue)}
      variant="scrollable"
      scrollButtons="auto"
      sx={{
        mb: 2,
        borderBottom: 1,
        borderColor: 'divider',
        '& .MuiTab-root': {
          textTransform: 'none',
          fontWeight: 500,
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