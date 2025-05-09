import React from 'react';
import AccessTabs from '../components/AccessTabs';
import OperationCheckboxes from '../components/OperationCheckboxes';
import { Box, Grid, Typography } from '@mui/material';

interface AccessPermissionsProps {
  accessOptions: { access: string; actions: string[] }[]; 
  currentModule: string;
  selectedPermissions: { [module: string]: string[] };
  onTabChange: (module: string) => void;
  onCheckboxChange: (module: string, action: string, checked: boolean) => void;
  readOnly?: boolean; 
}

const AccessPermissionsContainer: React.FC<AccessPermissionsProps> = ({
  accessOptions,
  currentModule,
  selectedPermissions,
  onTabChange,
  onCheckboxChange,
  readOnly = false, 
}) => {
  
  const currentOperations =
    accessOptions.find((m) => m.access === currentModule)?.actions || [];
  const selected = selectedPermissions[currentModule] || [];

  return (
    <Box sx={{ mt: 4 }}>
      
      <AccessTabs
        modules={accessOptions.map((opt) => opt.access)} 
        currentModule={currentModule}
        onChange={onTabChange}
      />

      {/* Grid Layout for Responsiveness */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ pl: 2 }}>
            Permissions for {currentModule}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          {/* Checkboxes for operations */}
          <OperationCheckboxes
            module={currentModule}
            operations={currentOperations}
            selected={selected}
            onChange={onCheckboxChange}
            readOnly={readOnly} 
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AccessPermissionsContainer;
