
// app/(dashboard)/access/edit/[id]/page.tsx

"use client";
import React from 'react';
import { Box, Typography } from '@mui/material';
import AccessEditForm from '../../../components/AccessEditForm';

const AccessEditPage: React.FC = () => {
  return (
    <div className="flex flex-col h-full m-4 p-4 overflow-hidden">
      {/* Header */}
      <Box sx={{ backgroundColor: '#741B92', color: 'white', p: 1.5, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
          Edit Access
        </Typography>
      </Box>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <AccessEditForm />
      </div>
    </div>
  );
};

export default AccessEditPage;
