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
  Box,
} from '@mui/material';
import { useTranslations } from 'next-intl';

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
        height: 260, // Fixed height for the entire card
        display: 'flex',
        flexDirection: 'column',
        mt: 2,
        borderRadius: 2,
        overflow: 'hidden', // Prevent content from spilling out
        '@media (max-width: 600px)': {
          maxWidth: '100%',
          padding: 1,
        },
      }}
    >
      <CardContent sx={{ padding: 2, flex: '1 1 auto', display: 'flex', flexDirection: 'column' }}>
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

        <FormGroup sx={{ flexDirection: 'column', flex: '1 1 auto' }}>
          {/* Select All */}
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

          {/* Scrollable Vertical List of Operations */}
          <Box
            sx={{
              height: 160, // Fixed height for operations list
              overflowY: 'auto', // Always scrollable if content exceeds height
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
              pr: 1,
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#888',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: '#555',
              },
            }}
          >
            {operations.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ p: 1 }}>
                {t('noOperationsAvailable')}
              </Typography>
            ) : (
              operations.map((operation) => (
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
              ))
            )}
          </Box>
        </FormGroup>
      </CardContent>
    </Card>
  );
};

export default OperationCheckboxes;