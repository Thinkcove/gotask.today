import React from 'react';
import { Box, Typography } from '@mui/material';
import AccessTabs from '../components/AccessTabs';
import OperationCheckboxes from '../components/OperationCheckboxes';
import FieldCheckboxes from '../components/FieldCheckboxes';

interface AccessPermissionsProps {
  accessOptions: { access: string; actions: string[] }[];
  fieldOptions: Record<string, any>;
  currentModule: string;
  selectedPermissions: { [module: string]: string[] };
  selectedFields: { [module: string]: string[] };
  onTabChange: (module: string) => void;
  onCheckboxChange: (module: string, action: string, checked: boolean) => void;
  onFieldChange: (module: string, action: string, field: string, checked: boolean) => void;
  readOnly?: boolean;
}

const AccessPermissionsContainer: React.FC<AccessPermissionsProps> = ({
  accessOptions,
  fieldOptions,
  currentModule,
  selectedPermissions,
  selectedFields,
  onTabChange,
  onCheckboxChange,
  onFieldChange,
  readOnly = false,
}) => {
  const currentOperations = accessOptions.find((m) => m.access === currentModule)?.actions || [];
  const selectedOps = selectedPermissions[currentModule] || [];
  const selectedFlds = selectedFields?.[currentModule] || [];

  console.log('fieldOptions', fieldOptions)

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
            justifyContent: 'space-between',
            gap: 1,
          }}
        >
          <Box sx={{ flex: 1, pr: 1 }}>
            <OperationCheckboxes
              module={currentModule}
              operations={currentOperations}
              selected={selectedOps}
              onChange={onCheckboxChange}
              readOnly={readOnly}
            />
          </Box>
          { !!selectedOps?.length && selectedOps.filter(Boolean).map((action, index) => (

          <Box key={index} sx={{ flex: 4, pl: 1 }}>
            <FieldCheckboxes
              module={currentModule}
              action={action}
              fields={fieldOptions?.fields?.[action?.toLowerCase()] || []}
              selected={selectedFlds}
              onChange={onFieldChange}
              readOnly={readOnly}
            />
          </Box>
          ))
        }
        </Box>
      </Box>
    </Box>
  );
};

export default AccessPermissionsContainer;
