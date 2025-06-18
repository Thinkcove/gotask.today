import React from "react";
import { Box, Typography } from "@mui/material";
import AccessTabs from "../components/AccessTabs";
import OperationCheckboxes from "../components/OperationCheckboxes";
import FieldCheckboxes from "../components/FieldCheckboxes";

interface AccessPermissionsProps {
  accessOptions: {
    access: string;
    actions: string[];
    restrictedFields: Record<string, string[]>;
     readOnlyFields: Record<string, Record<string, string[]>>;
  }[];
  currentModule: string;
  selectedPermissions: { [module: string]: string[] };
  selectedFields: { [module: string]: { [action: string]: string[] } };
  onTabChange: (module: string) => void;
  onCheckboxChange: (module: string, action: string, checked: boolean) => void;
  onFieldChange: (module: string, action: string, field: string, checked: boolean) => void;
  readOnly?: boolean;
  readOnlyFields: string[];
}

const AccessPermissionsContainer: React.FC<AccessPermissionsProps> = ({
  accessOptions,
  currentModule,
  selectedPermissions,
  selectedFields,
  onTabChange,
  onCheckboxChange,
  onFieldChange,
  readOnly = false
}) => {
  const currentModuleData = accessOptions.find((m) => m.access === currentModule);
  const currentOperations = currentModuleData?.actions || [];
  const restrictedFields = currentModuleData?.restrictedFields || {};
  const selectedOps = selectedPermissions[currentModule] || [];
  const selectedFlds = selectedFields[currentModule] || {};

  return (
    <Box
      sx={{
        px: 1,
        py: 3,
        bgcolor: "background.paper",
        borderRadius: 3,
        minHeight: 500, //  Increased height
        maxHeight: "75vh", // Responsive max height
        overflowY: "auto",
        userSelect: "none",
        transition: "all 0.3s ease-in-out"
      }}
    >
      <AccessTabs
        modules={accessOptions.map((opt) => opt.access)}
        currentModule={currentModule}
        onChange={onTabChange}
      />

      <Typography
        variant="h6"
        sx={{
          pl: 1,
          mb: 2,
          fontWeight: 700,
          color: "text.primary",
          borderLeft: "4px solid #1976d2",
          paddingLeft: "12px"
        }}
      ></Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "flex-start",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 3,
          pb: 2
        }}
      >
        <OperationCheckboxes
          module={currentModule}
          operations={currentOperations}
          selected={selectedOps}
          onChange={onCheckboxChange}
          readOnly={readOnly}
        />

        {selectedOps
          .filter(Boolean)
          .map((action) =>
            restrictedFields[action.toUpperCase()]?.length > 0 ? (
              <FieldCheckboxes
                key={action}
                module={currentModule}
                action={action}
                fields={restrictedFields[action.toUpperCase()] || []}
                selected={selectedFlds}
                onChange={onFieldChange}
             
              />
            ) : null
          )}
      </Box>
    </Box>
  );
};

export default AccessPermissionsContainer;
