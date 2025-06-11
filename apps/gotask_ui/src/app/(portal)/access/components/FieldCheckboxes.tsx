'use client';
import React from 'react';
import {
  Checkbox,
  FormControlLabel,
  Typography,
  Card,
  CardContent,
  Paper,
  Box,
} from '@mui/material';
import { useTranslations } from 'next-intl';

interface Props {
  module: string;
  action: string;
  fields: string[];
  selected: { [action: string]: string[] };
  onChange: (module: string, action: string, field: string, checked: boolean) => void;
  readOnly?: boolean;
}

const FieldCheckboxes: React.FC<Props> = ({
  module,
  action,
  fields,
  selected,
  onChange,
  readOnly = false,
}) => {
  const t = useTranslations('Access');
  const selectedFields = selected[action.toUpperCase()] || [];
  const allChecked = fields.length > 0 && fields.every((field) => selectedFields.includes(field));
  const someChecked = selectedFields.length > 0 && selectedFields.length < fields.length;

  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    fields.forEach((field) => {
      onChange(module, action.toUpperCase(), field, isChecked);
    });
  };

  return (
    <Card
      elevation={3}
      sx={{
        width: 320,
        height: 280,
        mt: 2,
        borderRadius: 3,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
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
          fontWeight={700}
          gutterBottom
          sx={{ fontSize: { xs: '1rem', sm: '1.1rem' }, color: 'success.main', userSelect: 'none' }}
        >
          {action}
        </Typography>

        <Paper
          elevation={0}
          sx={{
            backgroundColor: '#e8f5e9',
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
                disabled={readOnly}
                inputProps={{ 'aria-label': t('selectallFields') }}
                sx={{ p: 0.5 }}
              />
            }
            label={
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, fontSize: '0.9rem', userSelect: 'none' }}
              >
                {t('selectallFields')}
              </Typography>
            }
          />
        </Paper>

        <Box
          sx={{
            height: 180,
            overflowY: 'auto',
            pr: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 0.7,
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#a5d6a7',
              borderRadius: '8px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#81c784',
            },
          }}
        >
          {!fields.length ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ p: 1, textAlign: 'center', fontStyle: 'italic' }}
            >
              {t('noFieldsAvailable')}
            </Typography>
          ) : (
            fields.map((field) => (
              <FormControlLabel
                key={field}
                control={
                  <Checkbox
                    checked={selectedFields.includes(field)}
                    onChange={(e) =>
                      !readOnly && onChange(module, action.toUpperCase(), field, e.target.checked)
                    }
                    disabled={readOnly}
                    inputProps={{ 'aria-label': `${t('field')}: ${field}` }}
                    sx={{ p: 0.5 }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                    {field}
                  </Typography>
                }
                sx={{ ml: 2, userSelect: 'none' }}
              />
            ))
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default FieldCheckboxes;
