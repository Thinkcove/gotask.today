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
import { useTranslations } from 'next-intl'; // Ensure next-intl is configured

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
  const t = useTranslations('Access');
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
        width: '100%',
        maxWidth: 300,
        height: 'auto',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        mt: 2,
        borderRadius: 2,
        '@media (max-width: 600px)': {
          maxWidth: '100%',
          padding: 1,
        },
      }}
    >
      <CardContent sx={{ padding: 2 }}>
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{
            fontWeight: 600,
            fontSize: { xs: '0.9rem', sm: '1rem' },
            mb: 1,
          }}
        >
          {t('area')}: {module}
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
                  sx={{ pointerEvents: readOnly ? 'none' : 'auto', p: 0.5 }}
                  disabled={readOnly}
                  inputProps={{ 'aria-label': t('selectall') }}
                />
              }
              label={
                <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                  {t('selectall')}
                </Typography>
              }
            />
          </Paper>

          {operations.map((operation) => (
            <FormControlLabel
              key={operation}
              control={
                <Checkbox
                  checked={selected.includes(operation)}
                  onChange={(e) =>
                    !readOnly && onChange(module, operation, e.target.checked)
                  }
                  sx={{ pointerEvents: readOnly ? 'none' : 'auto', p: 0.5 }}
                  disabled={readOnly}
                  inputProps={{ 'aria-label': `${t('action')}: ${operation}` }}
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
