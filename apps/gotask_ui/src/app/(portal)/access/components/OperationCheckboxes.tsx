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
      elevation={3}
      sx={{
        width: 320,
        height: 280,
        display: 'flex',
        flexDirection: 'column',
        mt: 2,
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        '@media (max-width: 600px)': {
          width: '100%',
          height: 'auto',
          mb: 2,
        },
      }}
    >
      <CardContent
        sx={{
          padding: 2,
          flex: '1 1 auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{
            fontWeight: 700,
            fontSize: { xs: '1rem', sm: '1.1rem' },
            mb: 1,
            color: 'primary.main',
            userSelect: 'none',
          }}
        >
          {t('action')}
        </Typography>

        <FormGroup sx={{ flexDirection: 'column', flex: '1 1 auto' }}>
          <Paper
            elevation={0}
            sx={{
              backgroundColor: '#f5f5f5',
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
                <Typography
                  variant="body2"
                  sx={{ fontSize: '0.9rem', fontWeight: 600, userSelect: 'none' }}
                >
                  {t('selectall')}
                </Typography>
              }
            />
          </Paper>

          <Box
            sx={{
              height: 180,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 0.7,
              pr: 1,
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
                borderRadius: '8px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#c1c1c1',
                borderRadius: '8px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: '#9e9e9e',
              },
            }}
          >
            {operations.length === 0 ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ p: 1, textAlign: 'center', fontStyle: 'italic' }}
              >
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
                    <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                      {operation}
                    </Typography>
                  }
                  sx={{ ml: 2, userSelect: 'none' }}
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
