'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Container } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { getAccessRoleById, deleteAccessRole } from '../services/accessService';
import { AccessRole, AccessOption } from '../interfaces/accessInterfaces';
import { toast } from 'react-hot-toast';
import AccessPermissionsContainer from './AccessPermissionsContainer';
import Button from './Button';
import AccessHeading from './AccessHeading';

const AccessView: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const [accessRole, setAccessRole] = useState<AccessRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessOptions, setAccessOptions] = useState<AccessOption[]>([]);
  const [currentTab, setCurrentTab] = useState<string>('');

  useEffect(() => {
    const fetchRole = async () => {
      setLoading(true);
      const res = await getAccessRoleById(id as string);
      if (res.success && res.data) {
        setAccessRole(res.data);

        const selectedMap: Record<string, string[]> = {};
        res.data.application.forEach((app) => {
          selectedMap[app.access] = app.actions;
        });

        // Collect all modules from API and mark selected actions
        const fullAccessOptions = res.data.application.map((app) => ({
          access: app.access,
          actions: app.actions,
        }));

        setAccessOptions(fullAccessOptions);

        if (fullAccessOptions.length) setCurrentTab(fullAccessOptions[0].access);
      } else {
        setError(res.message || 'Failed to load access role.');
      }
      setLoading(false);
    };

    if (id) fetchRole();
  }, [id]);

  const handleDelete = async () => {
    if (!accessRole) return;
    const confirmed = window.confirm('Are you sure you want to delete this access role?');
    if (!confirmed) return;

    try {
      setLoading(true);
      const res = await deleteAccessRole(accessRole.id);
      if (res.success) {
        toast.success(res.message);
        router.push('/portal/access');
      } else {
        toast.error(res.message || 'Failed to delete role.');
      }
    } catch (err) {
      toast.error('Error deleting role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  if (!accessRole) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography>No Access Role Found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box className="bg-white rounded-xl shadow-md p-6 space-y-6">
        {/* Header with title and actions */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <AccessHeading title={accessRole.name} />
          <Box display="flex" gap={2}>
            <Button text="Back" onClick={() => router.back()} />
            <Button text="Edit" href={`/portal/access/pages/edit/${accessRole.id}`} />
            <Button text="Delete" onClick={handleDelete} />
          </Box>
        </Box>

        <Typography variant="h6" gutterBottom>
          Permissions
        </Typography>
        <hr />

        <AccessPermissionsContainer
          accessOptions={accessOptions}
          currentModule={currentTab}
          selectedPermissions={accessOptions.reduce((acc, option) => {
            acc[option.access] = option.actions;
            return acc;
          }, {} as Record<string, string[]>)}
          onTabChange={setCurrentTab}
          onCheckboxChange={() => {}}
          readOnly // Checkbox won't be editable, but visually enabled
        />
      </Box>
    </Container>
  );
};

export default AccessView;
