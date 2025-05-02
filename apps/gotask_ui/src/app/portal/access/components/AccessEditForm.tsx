'use client';

import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  getAccessOptions,
  getAccessRoleById,
  updateAccessRole,
} from '../services/accessService';
import { AccessOption, AccessRole } from '../interfaces/accessInterfaces';
import AccessPermissionsContainer from '../components/AccessPermissionsContainer';

export default function AccessEditForm() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [roleName, setRoleName] = useState<string>('');
  const [options, setOptions] = useState<AccessOption[]>([]);
  const [application, setApplication] = useState<AccessRole['application']>([]);
  const [currentTab, setCurrentTab] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const roleRes = await getAccessRoleById(String(id));
        const optionsRes = await getAccessOptions();

        if (roleRes.success && roleRes.data) {
          setRoleName(roleRes.data.name);
          setApplication(roleRes.data.application);
        }

        if (optionsRes.success && optionsRes.data) {
          setOptions(optionsRes.data);
        }

        const initialTab =
          roleRes.data?.application?.[0]?.access ||
          optionsRes.data?.[0]?.access ||
          '';

        setCurrentTab(initialTab);
      } catch (err) {
        console.error('Error loading data:', err);
        toast.error('Failed to fetch role or options');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handlePermissionChange = (access: string, action: string, checked: boolean) => {
    setApplication((prev) => {
      const updated = [...prev];
      const index = updated.findIndex((app) => app.access === access);

      if (index > -1) {
        let actions = updated[index].actions;

        actions = checked
          ? [...actions, action]
          : actions.filter((a) => a !== action);

        updated[index] = { ...updated[index], actions: [...new Set(actions)] };
      } else if (checked) {
        updated.push({ access, actions: [action] });
      }

      return updated;
    });
  };

  const handleTabChange = (module: string) => {
    setCurrentTab(module);
  };

  const handleSubmit = async () => {
    if (!roleName.trim()) {
      toast.error('Role name is required');
      return;
    }

    const payload = {
      name: roleName.trim(),
      application,
    };

    const res = await updateAccessRole(String(id), payload);
    if (res.success) {
      toast.success('Access role updated');
      router.push('/portal/access');
    } else {
      toast.error(res.message || 'Failed to update role');
    }
  };

  const selectedPermissionsMap = application.reduce((acc, app) => {
    acc[app.access] = app.actions;
    return acc;
  }, {} as Record<string, string[]>);

  if (loading) {
    return (
      <Box sx={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: '100vh', overflow: 'auto', p: 0, m: 0 }}>
      {/* Header with Back Button */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} p={2}>
        <Typography variant="h5" fontWeight={600}>
          Edit Access Role
        </Typography>
        <Button variant="contained" color="primary" onClick={() => router.push('/portal/access')}>
          Back
        </Button>
      </Box>

      {/* Role Name Input */}
      <Box mb={2} px={2}>
        <TextField
          fullWidth
          label="Access Name"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
        />
      </Box>

      {/* Module Select Dropdown */}
      <Box mb={2} px={2}>
        <Select
          fullWidth
          value={currentTab}
          onChange={(e) => setCurrentTab(e.target.value)}
        >
          {options.map((opt) => (
            <MenuItem key={opt.access} value={opt.access}>
              {opt.access.charAt(0).toUpperCase() + opt.access.slice(1)}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Permissions Table */}
      <Box mb={1} px={2}>
        {currentTab && (
          <AccessPermissionsContainer
            currentModule={currentTab}
            accessOptions={options}
            selectedPermissions={selectedPermissionsMap}
            onCheckboxChange={handlePermissionChange}
            onTabChange={handleTabChange}
          />
        )}
      </Box>

      {/* Bottom Action Buttons */}
      <Box display="flex" justifyContent="flex-end" gap={2} px={2} pb={2}>
        <Button variant="outlined" onClick={() => router.push('/portal/access')}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Box>
    </Box>
  );
}
