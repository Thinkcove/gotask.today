import React from 'react';
import { Box, Typography } from '@mui/material';
import AccessTabs from '../components/AccessTabs';
import OperationCheckboxes from '../components/OperationCheckboxes';
import FieldCheckboxes from '../components/FieldCheckboxes';

interface AccessPermissionsProps {
  accessOptions: { access: string; actions: string[]; restrictedFields: Record<string, string[]> }[];
  currentModule: string;
  selectedPermissions: { [module: string]: string[] };
  selectedFields: { [module: string]: { [action: string]: string[] } };
  onTabChange: (module: string) => void;
  onCheckboxChange: (module: string, action: string, checked: boolean) => void;
  onFieldChange: (module: string, action: string, field: string, checked: boolean) => void;
  readOnly?: boolean;
}

const AccessPermissionsContainer: React.FC<AccessPermissionsProps> = ({
  accessOptions,
  currentModule,
  selectedPermissions,
  selectedFields,
  onTabChange,
  onCheckboxChange,
  onFieldChange,
  readOnly = false,
}) => {
  const currentModuleData = accessOptions.find((m) => m.access === currentModule);
  const currentOperations = currentModuleData?.actions || [];
  const restrictedFields = currentModuleData?.restrictedFields || {};
  const selectedOps = selectedPermissions[currentModule] || [];
  const selectedFlds = selectedFields[currentModule] || {};

  return (
    <Box sx={{ mt: 2 }}>
      <AccessTabs
        modules={accessOptions.map((opt) => opt.access)}
        currentModule={currentModule}
        onChange={onTabChange}
      />

      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" sx={{ pl: 1, mb: 1 }}>
          Permissions for {currentModule}
        </Typography>

       <Box
  sx={{
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'wrap', // ensures items wrap nicely
    gap: 1, // controls spacing between elements
  }}
>
  <Box sx={{ pr: 1 }}>
    <OperationCheckboxes
      module={currentModule}
      operations={currentOperations}
      selected={selectedOps}
      onChange={onCheckboxChange}
      readOnly={readOnly}
    />
  </Box>

  {selectedOps
    .filter(Boolean)
    .map((action) =>
      restrictedFields[action.toUpperCase()]?.length > 0 ? (
        <Box
          key={action}
          // sx={{
          //   p: 1,
          //   border: '1px solid #e0e0e0',
          //   borderRadius: 2,
          //   flex: '0 1 300px', // fixed width with wrapping
          //   m: 0.5, // small margin between cards
          //   boxShadow: 1,
          //   backgroundColor: '#fafafa',
          // }}
        >
          <FieldCheckboxes
            module={currentModule}
            action={action}
            fields={restrictedFields[action.toUpperCase()] || []}
            selected={selectedFlds}
            onChange={onFieldChange}
            readOnly={readOnly}
          />
        </Box>
      ) : null
    )
    .filter(Boolean)}
</Box>

      </Box>
    </Box>
  );
};

export default AccessPermissionsContainer;