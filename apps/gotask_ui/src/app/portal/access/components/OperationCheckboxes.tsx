'use client';
import React from 'react';
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
  Card,
  CardContent,
  Paper,
} from '@mui/material';

interface Props {
  module: string;
  operations: string[];
  selected: string[];
  onChange: (module: string, operation: string, checked: boolean) => void;
  readOnly?: boolean;
}

const OperationCheckboxes: React.FC<Props> = ({
  module,
  operations,
  selected,
  onChange,
  readOnly = false,
}) => {
  const allChecked = operations.length > 0 && selected.length === operations.length;
  const someChecked = selected.length > 0 && selected.length < operations.length;

  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    operations.forEach((operation) => {
      onChange(module, operation, isChecked);
    });
  };

  return (
    <Card
      sx={{
        width: '100%', // Ensures the card is responsive
        maxWidth: 300, // Prevents the card from growing too wide
        height: 'auto',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        mt: 2,
        borderRadius: 2,
        // Responsive margin and padding
        '@media (max-width: 600px)': {
          maxWidth: '100%', // Full width on small screens
          padding: 1,
        },
      }}
    >
      <CardContent sx={{ padding: 2 }}>
        {/* 🔹 Module Title */}
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{
            fontWeight: 600,
            fontSize: { xs: '0.9rem', sm: '1rem' }, // Responsive font size
            mb: 1,
          }}
        >
          {module}
        </Typography>

        <FormGroup>
          {/* 🔷 Select All */}
          <Paper
            elevation={0}
            sx={{
              backgroundColor: '#e0f7fa',
              borderRadius: 1,
              px: 1,
              py: 0.5,
              mb: 1,
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={allChecked}
                  indeterminate={someChecked}
                  onChange={handleSelectAllChange}
                  sx={{
                    pointerEvents: readOnly ? 'none' : 'auto',
                    p: 0.5,
                  }}
                  disabled={readOnly}
                  inputProps={{
                    'aria-label': 'Select all operations',
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                  Select All
                </Typography>
              }
            />
          </Paper>

          {/* ✅ Individual Operation Checkboxes */}
          {operations.map((operation) => (
            <FormControlLabel
              key={operation}
              control={
                <Checkbox
                  checked={selected.includes(operation)}
                  onChange={(e) =>
                    !readOnly && onChange(module, operation, e.target.checked)
                  }
                  sx={{
                    pointerEvents: readOnly ? 'none' : 'auto',
                    p: 0.5,
                  }}
                  disabled={readOnly}
                  inputProps={{
                    'aria-label': `Select ${operation}`,
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                  {operation}
                </Typography>
              }
              sx={{ ml: 2 }}
            />
          ))}
        </FormGroup>
      </CardContent>
    </Card>
  );
};

export default OperationCheckboxes;
