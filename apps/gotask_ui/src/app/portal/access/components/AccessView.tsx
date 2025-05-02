'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Stack,
  useMediaQuery,
  useTheme,
  TextField,
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  getAccessRoleById,
  getAccessOptions,
  deleteAccessRole,
} from '../services/accessService';
import { AccessRole, AccessOption } from '../interfaces/accessInterfaces';
import AccessPermissionsContainer from './AccessPermissionsContainer';
import Button from './Button';
import AccessHeading from './AccessHeading';

const AccessView: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [accessRole, setAccessRole] = useState<AccessRole | null>(null);
  const [accessOptions, setAccessOptions] = useState<AccessOption[]>([]);
  const [currentTab, setCurrentTab] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const roleRes = await getAccessRoleById(id as string);
        const optionsRes = await getAccessOptions();

        if (!roleRes.success || !roleRes.data) {
          throw new Error(roleRes.message || 'Failed to load role.');
        }

        if (!optionsRes.success || !optionsRes.data) {
          throw new Error(optionsRes.message || 'Failed to load access options.');
        }

        setAccessRole(roleRes.data);
        setAccessOptions(optionsRes.data);

        const initialTab =
          roleRes.data.application?.[0]?.access ||
          optionsRes.data?.[0]?.access ||
          '';
        setCurrentTab(initialTab);
      } catch (err: any) {
        setError(err.message || 'Error fetching data.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (!accessRole) return;

    const confirmed = window.confirm('Are you sure you want to delete this access role?');
    if (!confirmed) return;

    try {
      setLoading(true);
      const res = await deleteAccessRole(accessRole.id);
      if (res.success) {
        toast.success(res.message || 'Role deleted successfully.');
        router.push('/portal/access');
      } else {
        toast.error(res.message || 'Failed to delete role.');
      }
    } catch (err) {
      toast.error('Unexpected error while deleting.');
    } finally {
      setLoading(false);
    }
  };

  const selectedPermissions = accessRole?.application?.reduce((acc, app) => {
    acc[app.access] = app.actions;
    return acc;
  }, {} as Record<string, string[]>) || {};

  if (loading) {
    return (
      <Box sx={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', m: 0, p: 0 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ width: '100%', height: '100vh', p: 2 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!accessRole) {
    return (
      <Box sx={{ width: '100%', height: '100vh', p: 2 }}>
        <Typography>No Access Role Found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: '100vh', overflow: 'auto', p: 0, m: 0 }}>
      {/* Header with Back and Actions */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} p={2} flexDirection={isMobile ? 'column' : 'row'} gap={2}>
        <AccessHeading title={accessRole.name} />
        <Stack direction={isMobile ? 'column' : 'row'} spacing={1} width={isMobile ? '100%' : 'auto'}>
          <Button text="Back" onClick={() => router.back()} fullWidth={isMobile} />
          <Button text="Edit" href={`/portal/access/pages/edit/${accessRole.id}`} fullWidth={isMobile} />
          <Button text="Delete" onClick={handleDelete} fullWidth={isMobile} />
        </Stack>
      </Box>

      {/* Access Name (read-only) */}
      <Box mb={2} px={2}>
        <TextField
          fullWidth
          label="Access Name"
          value={accessRole.name}
          disabled
        />
      </Box>

      {/* Permissions Table */}
      <Box px={2} sx={{ height: 'calc(100vh - 150px)', overflowY: 'auto' }}>
        <Typography variant="h6" gutterBottom>
          Permissions
        </Typography>
        <hr />

        <AccessPermissionsContainer
          accessOptions={accessOptions}
          currentModule={currentTab}
          selectedPermissions={selectedPermissions}
          onTabChange={setCurrentTab}
          onCheckboxChange={() => {}}
          readOnly
        />
      </Box>
    </Box>
  );
};

export default AccessView;
