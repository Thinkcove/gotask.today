"use client";
import React, { useState } from "react";
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
import { useAccessOptions, createAccessRole } from "../services/accessService";
import { AccessOption, AccessRole } from "../interfaces/accessInterfaces";

const AccessCreateForm: React.FC = () => {
  const [accessName, setAccessName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<Record<string, string[]>>({});
  const [currentModule, setCurrentModule] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const { accessOptions, isLoading, error } = useAccessOptions();

  console.log("AccessCreateForm accessOptions:", accessOptions); // Debug log
  console.log("AccessCreateForm isLoading:", isLoading); // Debug log
  console.log("AccessCreateForm error:", error); // Debug log

  // Set initial currentModule when accessOptions load
  if (accessOptions.length > 0 && !currentModule) {
    setCurrentModule(accessOptions[0].access);
  }

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
      id: "",
      createdAt: undefined
    };

    try {
      setIsSubmitting(true);
      const response = await createAccessRole(payload);
      console.log("createAccessRole response:", response); // Debug log
      if (response.success) {
        router.push("/portal/access");
      } else {
        alert(response.message);
      }
    } catch (err) {
      console.error("Failed to create access role:", err);
      alert("Failed to create access role.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

        {isLoading ? (
          <Box display="flex" justifyContent="center" mt={5}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box display="flex" justifyContent="center" mt={5}>
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          </Box>
        ) : accessOptions.length === 0 ? (
          <Box display="flex" justifyContent="center" mt={5}>
            <Typography variant="body1" color="text.secondary">
              No Access Options Available.
            </Typography>
          </Box>
        ) : (
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
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => router.push("/portal/access")}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={20} /> : "Create Access"}
        </Button>
      </Box>
    </Box>
  );
};

export default AccessCreateForm;