"use client";
import React from 'react';
import { Box, Typography } from '@mui/material';
import AccessEditForm from '../../../components/AccessEditForm';

const AccessEditPage: React.FC = () => {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden m-0 p-0">
      {/* Header */}
      <Box
        sx={{
          backgroundColor: '#741B92',
          color: 'white',
          py: 2,
          px: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
          Edit Access
        </Typography>
      </Box>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <AccessEditForm />
      </div>
    </div>
  );
};

export default AccessEditPage;
