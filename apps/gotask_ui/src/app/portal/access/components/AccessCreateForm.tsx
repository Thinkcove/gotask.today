// components/AccessCreateForm.tsx

"use client";
import React, { useEffect, useState } from "react";
import {
  TextField,
  Typography,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import { useRouter } from "next/navigation";

import AccessHeading from "./AccessHeading";
import AccessPermissionsContainer from "../components/AccessPermissionsContainer";
import { getAccessOptions, createAccessRole } from "../services/accessService";
import { AccessOption, AccessRole } from "../interfaces/accessInterfaces";

const AccessCreateForm: React.FC = () => {
  const [accessName, setAccessName] = useState("");
  const [accessOptions, setAccessOptions] = useState<AccessOption[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<Record<string, string[]>>({});
  const [currentModule, setCurrentModule] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await getAccessOptions();
        const data: AccessOption[] = Array.isArray(response?.data) ? response.data : [];
        setAccessOptions(data);

        if (data.length > 0) {
          setCurrentModule(data[0].access);
        }
      } catch (error) {
        console.error("Failed to fetch access options:", error);
      }
    };

    fetchOptions();
  }, []);

  const handleCheckboxChange = (module: string, action: string, checked: boolean) => {
    setSelectedPermissions((prev) => {
      const existing = prev[module] || [];
      const updated = checked
        ? [...new Set([...existing, action])]
        : existing.filter((a) => a !== action);
      return { ...prev, [module]: updated };
    });
  };

  const handleSubmit = async () => {
    if (!accessName.trim()) {
      alert("Access name is required!");
      return;
    }

    const application = Object.entries(selectedPermissions).map(([access, actions]) => ({
      access,
      actions,
    }));

    const payload: AccessRole = {
      name: accessName,
      application,
    };

    try {
      setLoading(true);
      const response = await createAccessRole(payload);
      if (response.success) {
        router.push("/portal/access");
      } else {
        alert(response.message);
      }
    } catch (err) {
      console.error("Failed to create access role", err);
    } finally {
      setLoading(false);
    }
  };

  const currentActions = accessOptions.find((opt) => opt.access === currentModule)?.actions || [];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "90vh",
        width: "100%",
        bgcolor: "white",
        borderRadius: 2,
        boxShadow: 3,
        p: 2,
      }}
    >
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        <AccessHeading title="Create Access" />
        <TextField
          label="Access Name"
          variant="outlined"
          required
          value={accessName}
          onChange={(e) => setAccessName(e.target.value)}
          sx={{ mb: 2, width: "100%" }}
        />

        <Typography variant="h6">Access Management</Typography>

        {accessOptions.length > 0 && currentModule && (
          <AccessPermissionsContainer
            accessOptions={accessOptions}
            currentModule={currentModule}
            selectedPermissions={selectedPermissions}
            onTabChange={setCurrentModule}
            onCheckboxChange={handleCheckboxChange}
          />
        )}
      </Box>

      <Box
        sx={{
          borderTop: 1,
          borderColor: "gray",
          pt: 2,
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
        }}
      >
        <Button variant="outlined" color="secondary" onClick={() => router.push("/portal/access/pages")}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? <CircularProgress size={20} /> : "Create Access"}
        </Button>
      </Box>
    </Box>
  );
};

export default AccessCreateForm;
